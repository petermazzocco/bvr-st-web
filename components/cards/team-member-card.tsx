import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

type TeamMemberCardProps = {
  name: string;
  title: string;
  image: string;
  socials: {
    icon: JSX.Element;
    url: string;
  }[];
};

export const TeamMemberCard = ({
  name,
  title,
  image,
  socials,
}: TeamMemberCardProps) => {
  return (
    <Card className="w-full max-w-sm border-none ">
      <CardHeader className="px-0">
        <AspectRatio ratio={1 / 1} className="relative group">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-md object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex items-center justify-center">
            <div className="grid grid-cols-2 gap-2">
              {socials.map((item, index) => (
                <div
                  key={index}
                  className="w-16 h-16 text-white hover:text-primary transition-colors"
                >
                  {item.icon}
                </div>
              ))}
            </div>
          </div>
        </AspectRatio>
        <CardTitle>
          <h2>{name}</h2>
          <span className="text-muted-foreground/80 text-[0.6rem] mt-1 uppercase">
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};
