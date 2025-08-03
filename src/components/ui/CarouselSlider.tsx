import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// Define your tech stack with direct Iconify URLs or use a different approach
const techStackData = {
  tech: [
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Go", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
  ],
  frameworks: [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Vue", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
    { name: "Svelte", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg" },
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { name: "Nuxt", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg" },
  ],
  devops: [
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name: "GitLab", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg" },
    { name: "Nginx", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" },
  ]
}

// Single carousel component
export function CarouselSpacing(props: { 
  title: string, 
  items: Array<{name: string, icon: string}> 
}) {
  if (props.items.length === 0) {
    return (
      <div className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">{props.title}</h2>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="text-sm text-yellow-800">
            ⚠️ No {props.title.toLowerCase()} icons configured.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <h2 className="mb-4 text-xl font-semibold">{props.title}</h2>
      <Carousel className="w-full max-w-sm">
        <CarouselContent className="-ml-1">
          {props.items.map((item, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6 flex-col">
                    <img 
                      src={item.icon}
                      alt={item.name}
                      className="w-12 h-12 mb-2 object-contain"
                      onError={(e) => {
                        console.error(`❌ Failed to load ${item.name}:`, item.icon);
                        // Replace with fallback
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-12 h-12 mb-2 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-gray-600 text-xs font-bold';
                        fallback.textContent = item.name.substring(0, 2).toUpperCase();
                        target.parentNode?.insertBefore(fallback, target);
                      }}
                      onLoad={() => {
                        console.log(`✅ Successfully loaded ${item.name}`);
                      }}
                    />
                    <span className="text-sm font-medium text-center">{item.name}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

// Main component
export function TechStackCarousels() {
  return (
    <div className="space-y-8">
      <div className="text-sm text-gray-600 mb-4">
        Tech Stack Overview - Using CDN Icons
      </div>
      <CarouselSpacing title="Programming Languages" items={techStackData.tech} />
      <CarouselSpacing title="Frameworks & Libraries" items={techStackData.frameworks} />
      <CarouselSpacing title="DevOps & Tools" items={techStackData.devops} />
    </div>
  );
}