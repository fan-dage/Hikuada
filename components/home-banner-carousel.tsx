"use client";

import { BANNER_UPLOAD_PREFIX } from "@/lib/banner-constants";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type BannerSlide = {
  src: string;
  alt: string;
};

const INTERVAL_MS = 6500;

export function HomeBannerCarousel({ slides }: { slides: BannerSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = slides.length;
  const go = useCallback(
    (next: number) => {
      if (count <= 0) return;
      const i = ((next % count) + count) % count;
      setIndex(i);
    },
    [count],
  );

  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (count === 0) {
    return null;
  }

  if (count === 1) {
    const s = slides[0];
    return (
      <div className="relative z-0 min-h-[500px] h-[56vh] w-full md:min-h-[320px] md:h-[56vh]">
        <Image
          src={s.src}
          alt={s.alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          unoptimized={s.src.startsWith(BANNER_UPLOAD_PREFIX)}
        />
      </div>
    );
  }

  return (
    <div
      className="relative z-0 min-h-[500px] h-[56vh] w-full md:min-h-[320px] md:h-[56vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-full w-full overflow-hidden bg-slate-900">
        {slides.map((slide, i) => (
          <div
            key={`${slide.src}-${i}`}
            className={`absolute inset-0 transition-opacity duration-[800ms] ease-out ${
              i === index ? "z-[1] opacity-100" : "z-0 opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
              unoptimized={slide.src.startsWith(BANNER_UPLOAD_PREFIX)}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-auto absolute inset-x-0 bottom-5 z-[2] flex items-center justify-center gap-2 px-4 sm:bottom-6">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`显示第 ${i + 1} 张横幅`}
            aria-current={i === index ? "true" : undefined}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === index ? "scale-110 bg-white shadow-sm" : "bg-white/45 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      <div className="pointer-events-auto absolute inset-y-0 left-2 z-[2] flex items-center md:left-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="上一张横幅"
          className="rounded-full bg-black/35 px-2 py-3 text-white backdrop-blur-sm transition hover:bg-black/50 md:px-3"
        >
          ‹
        </button>
      </div>
      <div className="pointer-events-auto absolute inset-y-0 right-2 z-[2] flex items-center md:right-4">
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="下一张横幅"
          className="rounded-full bg-black/35 px-2 py-3 text-white backdrop-blur-sm transition hover:bg-black/50 md:px-3"
        >
          ›
        </button>
      </div>
    </div>
  );
}
