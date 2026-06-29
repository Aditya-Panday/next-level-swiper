"use client";

import Image from "next/image";
import LeftSlideButton from "../customSwiper/swiperButtons/leftSlideButton";
import RightSlideButton from "../customSwiper/swiperButtons/rightSlideButton";
import { useCarousel } from "./slideCarousel";

interface GalleryImage {
  id: string | number;
  mainUrl: string;
  thumbnailUrl: string;
  alt?: string;
}

interface MainImageViewProps {
  images: GalleryImage[];
  countVisible: boolean;
}

export default function MainImageView({
  images,
  countVisible,
}: MainImageViewProps) {
  const { activeIndex, prev, next } = useCarousel();

  return (
    <div
      /**
       * role="img" on a div is intentional here.
       * The element acts as a single labelled image region.
       * Individual <img> elements inside have their own alt text,
       * but at the container level we expose a single label for AT.
       *
       * tabIndex=0 makes the stage keyboard-focusable so arrow-key nav
       * works for users who tab to the carousel.
       */
      role="img"
      tabIndex={0}
      aria-label={
        images[activeIndex]?.alt ??
        `Image ${activeIndex + 1} of ${images.length}`
      }
      className={[
        "relative aspect-video w-full overflow-hidden rounded-sm bg-slate-950",
        "outline-none",
        // Visible focus ring via box-shadow (outline doesn't respect border-radius well)
        "focus-visible:[box-shadow:0_0_0_3px_theme(colors.indigo.500)]",
      ].join(" ")}
    >
      {/*
        All images stacked, opacity driven by data-active attribute.
        Benefits:
          - No key remount → no flicker between slides
          - CSS crossfade works including wrap-around (index N-1 → 0)
          - Browser pre-downloads adjacent images in background
          - GPU-composited opacity transition (no layout/paint)
      */}
      {images.map((img, i) => (
        <Image
          key={img.id}
          src={img.mainUrl}
          alt={img.alt ?? `Image ${i + 1}`}
          fill
          priority={i === 0}
          fetchPriority={i === 0 ? "high" : "low"}
          loading={i === 0 ? "eager" : "lazy"}
          className={[
            "object-cover transition-opacity duration-300",
            i === activeIndex ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
      ))}

      {/* Navigation buttons */}
      <LeftSlideButton onClick={prev} />
      <RightSlideButton onClick={next} />

      {/* Slide counter (optional) */}
      {countVisible && (
        <span
          aria-hidden="true" // redundant info for sighted users; SR gets it from aria-live
          className="absolute bottom-3 right-3 z-20 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm"
        >
          {activeIndex + 1} / {images.length}
        </span>
      )}
    </div>
  );
}
