"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

const slides = [
  {
    id: 1,
    title: "Học tập mọi lúc mọi nơi",
    description: "Truy cập khóa học từ mọi thiết bị, mọi thời điểm",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070",
    link: "/courses",
  },
  {
    id: 2,
    title: "Học cùng chuyên gia",
    description: "Nội dung được biên soạn bởi các chuyên gia hàng đầu",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071",
    link: "/courses",
  },
  {
    id: 3,
    title: "Cộng đồng học tập",
    description: "Tham gia cộng đồng học tập sôi động",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070",
    link: "/courses",
  },
];

export default function HeroCarousel() {
  const plugin = Autoplay({ delay: 5000, stopOnInteraction: true });

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[plugin]}
      className="w-full overflow-hidden rounded-lg"
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative h-[600px] w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover brightness-50"
                priority={slide.id === 1}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 max-w-3xl">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl mb-8 max-w-2xl">
                  {slide.description}
                </p>
                <Button size="lg" asChild>
                  <Link href={slide.link}>Khám phá ngay</Link>
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
