"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { useEffect, useState } from "react";
import { type CarouselApi } from "~/components/ui/carousel";
import { Circle, CircleArrowRight, MoveLeft, MoveRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { placeholderItems } from "./placeholderItems";

export default function HeaderCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl overflow-hidden">
      <Carousel
        className="h-full w-full"
        setApi={setApi}
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4500,
            stopOnMouseEnter: true,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {placeholderItems.map((item, index) => (
            <HeadItem item={item} key={index} />
          ))}
        </CarouselContent>
        <CarouselNext className="absolute right-5 top-1/2 opacity-50" />
        <CarouselPrevious className="absolute left-5 top-1/2 opacity-50" />
        <div className="pointer-events-none absolute bottom-8 z-10 w-full">
          <div className="hidden w-full items-center justify-center md:flex">
            <div className="pointer-events-auto">
              <CarouselDots count={count} current={current} api={api} />
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
}

function CarouselDots({
  count,
  current,
  api,
}: {
  count: number;
  current: number;
  api: CarouselApi | undefined;
}) {
  return (
    <div className="flex items-center gap-2 py-2 text-sm opacity-50">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`aspect-square h-2 rounded-full ${index + 1 == current ? "bg-slate-200" : "bg-slate-600"} cursor-pointer hover:opacity-50`}
          onClick={() => api?.scrollTo(index)}
        ></div>
      ))}
    </div>
  );
}

function HeadItem({
  item,
}: {
  item: {
    name: string;
    id: string;
    url: string;
    description: string;
    userID: string;
    imageURL: string;
    importance: null;
    visits: never[];
    keywords: string[];
    tags: never[];
    createdAt: Date;
    updatedAt: null;
  };
}) {
  const [colors, setColors] = useState<string[]>([]);
  const textColor = "#fff";

  return (
    <CarouselItem>
      <div
        className="flex h-96 w-full items-end justify-start bg-[#0a0a0a] p-8 py-10"
        style={{
          background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`,
          color: textColor,
        }}
      >
        <span
          className="text-4xl font-semibold"
          onClick={() => alert("clicked")}
        >
          <div className="flex gap-4">
            <img
              src={item.imageURL ?? undefined}
              className="aspect-square h-9 rounded-full bg-transparent object-cover"
            />
            <div className="flex flex-col gap-4">
              <div className="text-2xl">{item.name}</div>
              <div className="text-base">{item.description}</div>
            </div>
          </div>
        </span>
      </div>
    </CarouselItem>
  );
}
