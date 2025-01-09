import type { HTMLAttributes } from "astro/types";
interface NavigationData{
    title: string;
    path: string;
    icon: {
        name: string;
        title?: string;
        /** Shorthand for including a <desc>{props.desc}</desc> element in the SVG */
        desc?: string;
        /** Shorthand for setting width and height */
        size?: number | string;
        width?: number | string;
        height?: number | string;
    }
};

// interface IconProps extends HTMLAttributes<'svg'>{
//     name: string;
//     title?: string;
//     desc?: string;
//     size?: number | string;
//     width?: number | string;
//     height?: number | string;
// }


const NavData: NavigationData[] = [
    {
        title: "Home",
        path: "/",
        icon: {
            name: "Home.svg",
            width: 24,
            height: 24
        },
    },
    {
        title: "Project",
        path: "/project/",
        icon: {
            name: "Project.svg",
            width: 24,
            height: 24
        },
    },
    {
        title: "About",
        path: "/about/",
        icon: {
            name: "About.svg",
            width: 24,
            height: 24
        },
    },
];


// const Icon = ({name , title , desc , size , width , height, ...rest} : IconProps)=>{
//     // Dynamic SVG rendering (example, replace with your actual logic)
//     const SvgIcon = `@/icons/${name}`;
//     return (
//         <svg
//         width = {width || size}
//         height = {height || size}
//         {...rest}
//         >
//         <use href={SvgIcon} />
//         </svg>
//     )
// }

const Icons = {
    Home : "@icons/Home.svg",
    About : "@icons/About.svg",
    Project : "@icons/Project.svg",
}

export default NavData 