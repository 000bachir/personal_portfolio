import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import type { HTMLAttributes } from "astro/types";
import { transformUrl, parseUrl } from "unpic";

type Layout = 'fixed' | 'constrained' | 'fullWidth' | 'cover' | 'responsive' | 'contained';

export interface ImageProp extends Omit<HTMLAttributes<'img'>, 'src'> {
  src?: string | ImageMetadata | null;
  width?: string | number | null;
  height?: string | number | null;
  alt?: string | null;
  loading?: 'eager' | 'lazy' | null;
  decoding?: 'sync' | 'async' | 'auto' | null;
  style?: string;
  srcset?: string | null;
  sizes?: string | null;
  fetchpriority?: 'high' | 'low' | 'auto' | null;

  layout?: Layout;
  widths?: number[] | null;
  aspectRatio?: string | number | null
  objectPosition?: string;
  format?: string
}

export type ImagesOptimizer = (
  image: ImageMetadata | string,
  breakpoints: number[],
  width?: number,
  height?: number,
  format?: string
) => Promise<Array<{ src: string; width: number }>>;

const config = {
  // FIXME: Use this when image.width is minor than deviceSizes
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

  deviceSizes: [
    640, // older and lower-end phones
    750, // iPhone 6-8
    828, // iPhone XR/11
    960, // older horizontal phones
    1080, // iPhone 6-8 Plus
    1280, // 720p
    1668, // Various iPads
    1920, // 1080p
    2048, // QXGA
    2560, // WQXGA
    3200, // QHD+
    3840, // 4K
    4480, // 4.5K
    5120, // 5K
    6016, // 6K
  ],

  formats: ['image/webp'],
};

let computeHeight = (width: number, aspectRatio: number) => {
  return Math.floor(width / aspectRatio);
}

const parseAspectRatio = (aspectRatio: number | string | null | undefined): number | undefined => {
  if (typeof aspectRatio === 'number') return aspectRatio
  if (typeof aspectRatio === 'string') {
    const match = aspectRatio.match(/(\d+)\s*[/:]\s*(\d+)/);

    if (match) {
      const [, Numerator, Denominator] = match.map(Number);
      if (Denominator && !isNaN(Numerator)) return Numerator / Denominator
    } else {
      const numericValue = parseFloat(aspectRatio)
      if (!isNaN(numericValue)) return numericValue
    }
  }
  return undefined
}
/**
 *! Gets the `sizes` attribute for an image, based on the layout and width
 */
export const getSizes = (width?: number, layout?: Layout): string | undefined => {
  if (!width || !layout) {
    return undefined
  }

  switch (layout) {
    //* If screen is wider than the max size, image width is the max size,
    //* otherwise it's the width of the screen
    case `constrained`:
      return `(min-width : ${width}px) ${width}px , 100vw`
    //* Image is always the same width, whatever the size of the screen
    case `fixed`:
      return `${width}px`

    //* image is always the width of the screen
    case `fullWidth`:
      return `100vw`

    default:
      return undefined

  }
};

const pixelPlate = (value?: number) => (
  value || value === 0 ? `${value}px ` : undefined
);

const getStyles = ({ width, height, aspectRatio, layout, objectFit = 'cover', objectPosition = 'center', background }:
  { width?: number; height?: number; aspectRatio?: number; layout?: string; objectFit?: string; objectPosition?: string; background?: string }) => {
  const stylesEntries: Array<[prop: string, value: string | undefined]> = [
    ['object-fit', objectFit],
    ['object-position', objectPosition]
  ];

  //*if a background is a url set it to no repeat and to cover
  if (background?.startsWith('https:') || background?.startsWith('http:') || background?.startsWith('data:')) {
    stylesEntries.push(['background-image', `url(${background})`]);
    stylesEntries.push(['background-size', 'cover'])
    stylesEntries.push(['background-repeat', 'no-repeat'])
  } else {
    stylesEntries.push(['background', background])
  }

  if (layout === 'fixed') {
    stylesEntries.push(['width', pixelPlate(width)])
    stylesEntries.push(['height', pixelPlate(height)])
    stylesEntries.push(['object-position', 'top-left'])
  }
  if (layout === 'constrained') {
    stylesEntries.push(['max-width', pixelPlate(width)])
    stylesEntries.push(['max-height', pixelPlate(height)])
    stylesEntries.push(['aspect-ratio', aspectRatio ? `${aspectRatio}` : undefined])
    stylesEntries.push(['width', '100%'])
  }

  if (layout === 'fullWidth') {
    stylesEntries.push(['width', "100%"])
    stylesEntries.push(['height', pixelPlate(height)])
    stylesEntries.push(['aspect-ratio', aspectRatio ? `${aspectRatio}` : undefined])
  }

  if (layout === 'responsive') {
    stylesEntries.push(['width', "100%"])
    stylesEntries.push(['height', 'auto'])
    stylesEntries.push(['aspect-ratio', aspectRatio ? `${aspectRatio}` : undefined])
  }
  if (layout === 'contained') {
    stylesEntries.push(['max-width', "100%"])
    stylesEntries.push(['max-height', '100%'])
    stylesEntries.push(['object-fit', 'contain'])
    stylesEntries.push(['aspect-ratio', aspectRatio ? `${aspectRatio}` : undefined])
  }
  if (layout === 'cover') {
    stylesEntries.push(['max-width', "100%"])
    stylesEntries.push(['max-height', '100%'])
  }

  const styles = Object.fromEntries(stylesEntries.filter(([, value]) => value))
  return Object.entries(styles).map(([key, value]) => `${key} : ${value}`).join(' ')

}

const getBreakpoints = ({
  width , 
  breakpoints , 
  layout
}:{
  width? : number ,
  breakpoints? : number[] ,
  layout : Layout
}) : number[] => {
  if(layout ==='fullWidth'  || layout ==='contained' || layout ==='cover' || layout ==='responsive'){
    return breakpoints || config.deviceSizes
  }
  if(!width){
    return []
  }
  const doubleWidth = width * 2 
  if(layout === 'fixed') {
    return [width , doubleWidth]
  }
  if(layout === 'constrained') {
    return [
      // Always include the image at 1x and 2x the specified width
      width ,
      doubleWidth ,
      // Filter out any resolutions that are larger than the double-res image
      ...(breakpoints || config.deviceSizes).filter((w)=> w < doubleWidth)
    ]
  }
  return []
}


export const astroAssetsOptimizer: ImagesOptimizer = async (image, breakpoints, _width, _height, format = undefined) => {
  if (!image) {
    return []
  }
  return Promise.all(
    breakpoints.map(async (w: number) => {
      const result = await getImage({ src: image, width: w, inferSize: true, ...(format ? { format: format } : {}) });

      return {
        src: result?.src,
        width: result?.attributes?.width ?? w,
        height: result?.attributes?.height,

      }

    })
  )
}

export const isUnpicIsCompatible = (image: string) => {
  return typeof parseUrl(image) !== 'undefined'
}



export const unpicOptimizer: ImagesOptimizer = async (image, breakpoint, width, height, format = undefined) => {
  if (!image || typeof image !== "string") {
    return []
  }
  const urlParsed = parseUrl(image)
  if (!urlParsed) {
    return []
  }

  return Promise.all(
    breakpoint.map(async (w: number) => {
      const _height = width && height ? computeHeight(w, width / height) : height;
      const url = transformUrl({
        url: image,
        width: w,
        height: _height,
        cdn: urlParsed.cdn,
        ...(format ? { format: format } : {}),

      }) || image
      return {
        src: String(url),
        width: w,
        height: _height
      }
    })
  )
}

export async function getImagesOptimized(
  image: ImageMetadata | string,
  {
    src: _,
    width,
    height,
    sizes,
    aspectRatio,
    objectPosition,
    widths,
    layout = 'constrained',
    style = '',
    format,
    ...rest
  }: ImageProp,
  transform: ImagesOptimizer = () => Promise.resolve([])
): Promise<{ src: string; attributes: HTMLAttributes<'img'> }> {
  if (typeof image !== 'string') {
    width ||= Number(image.width) || undefined;
    height ||= typeof width === 'number' ? computeHeight(width, image.width / image.height) : undefined;
  }

  width = (width && Number(width)) || undefined;
  height = (height && Number(height)) || undefined;

  widths ||= config.deviceSizes;
  sizes ||= getSizes(Number(width) || undefined, layout);
  aspectRatio = parseAspectRatio(aspectRatio);

  // Calculate dimensions from aspect ratio
  if (aspectRatio) {
    if (width) {
      if (height) {
        /* empty */
      } else {
        height = width / aspectRatio;
      }
    } else if (height) {
      width = Number(height * aspectRatio);
    } else if (layout !== 'fullWidth') {
      // Fullwidth images have 100% width, so aspectRatio is applicable
      console.error('When aspectRatio is set, either width or height must also be set');
      console.error('Image', image);
    }
  } else if (width && height) {
    aspectRatio = width / height;
  } else if (layout !== 'fullWidth') {
    // Fullwidth images don't need dimensions
    console.error('Either aspectRatio or both width and height must be set');
    console.error('Image', image);
  }

  let breakpoints = getBreakpoints({ width: width, breakpoints: widths, layout: layout });
  breakpoints = [...new Set(breakpoints)].sort((a, b) => a - b);

  const srcset = (await transform(image, breakpoints, Number(width) || undefined, Number(height) || undefined, format))
    .map(({ src, width }) => `${src} ${width}w`)
    .join(', ');

  return {
    src: typeof image === 'string' ? image : image.src,
    attributes: {
      width: width,
      height: height,
      srcset: srcset || undefined,
      sizes: sizes,
      style: `${getStyles({
        width: width,
        height: height,
        aspectRatio: aspectRatio,
        objectPosition: objectPosition,
        layout: layout,
      })}${style ?? ''}`,
      ...rest,
    },
  };
}