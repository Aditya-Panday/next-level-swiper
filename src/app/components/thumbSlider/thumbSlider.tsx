"use client";

import { MainImageThumbnailCarouselProps } from "@/src/types/craousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";

const MainImageThumbnailCarousel: React.FC<MainImageThumbnailCarouselProps> = ({
  images,
  initialIndex = 0,
  className = "",
  thumbsVisible = 5,
  countVisible = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, Math.min(initialIndex, images.length - 1)),
  );
  const activeThumbRef = useRef<HTMLButtonElement>(null);

  const active = images[activeIndex];

  const goTo = (index: number) => {
    setActiveIndex((prev) => {
      const clamped = (index + images.length) % images.length;
      return clamped !== prev ? clamped : prev;
    });
  };

  const prev = () =>
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const handleMainKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  // FIX: scrollIntoView — simpler and correct
  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  if (!images.length) return null;

  return (
    <section
      className={`mx-auto flex w-full max-w-225 flex-col gap-3 ${className}`}
      aria-label="Image gallery"
      role="region"
    >
      {/* ── Main Image ── */}
      <div
        className="relative aspect-video w-full overflow-hidden rounded-sm bg-slate-950 outline-none focus-visible:[box-shadow:0_0_0_3px_#6366f1]"
        onKeyDown={handleMainKeyDown}
        tabIndex={0}
        role="img"
        aria-label={
          active?.alt ?? `Image ${activeIndex + 1} of ${images.length}`
        }
      >
        {/*
          FIX: Render ALL images stacked — removes key-remount issue.
          CSS data-[active] drives opacity; crossfade always plays (including wrap-to-0).
          Browser preloads next/prev images in background too.
        */}
        {images.map((img, i) => (
          <Image
            key={img.id}
            src={img.mainUrl}
            alt={img.alt ?? `Gallery image ${i + 1}`}
            fetchPriority={i === activeIndex ? "high" : "auto"}
            data-active={i === activeIndex ? "" : undefined}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200 ease-in-out data-[active]:opacity-100"
            loading={i === activeIndex ? "eager" : "lazy"}
            priority={i === activeIndex}
            fill
            sizes="(max-width: 900px) 100vw, 900px"
          />
        ))}

        {/* Previous */}
        <button
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 backdrop-blur-sm transition-[background,scale] duration-150 hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-indigo-500 max-sm:h-8 max-sm:w-8"
        >
          <ArrowLeft className="h-5 w-5 max-sm:h-4 max-sm:w-4" />
        </button>

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next image"
          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 backdrop-blur-sm transition-[background,scale] duration-150 hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-indigo-500 max-sm:h-8 max-sm:w-8"
        >
          <ArrowRight className="h-5 w-5 max-sm:h-4 max-sm:w-4" />
        </button>

        {/* Counter */}
        {countVisible && (
          <span className="absolute bottom-3 right-3 z-20 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/*
        FIX: aria-live region — screen readers announce slide changes on keyboard nav.
        sr-only keeps it visually hidden.
      */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {active?.alt ?? `Image ${activeIndex + 1} of ${images.length}`}
      </div>

      {/* ── Thumbnail Strip ── */}
      {/*
        FIX: role="tablist" added — completes the tab/tablist ARIA pair.
        FIX: CSS variable on container instead of inline style per thumb.
      */}
      <div
        role="tablist"
        aria-label="Image thumbnails"
        className="no-scrollbar flex gap-2 overflow-x-auto px-1"
        style={{ "--thumbs-visible": thumbsVisible } as React.CSSProperties}
      >
        {images.map((img, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={img.id}
              ref={isActive ? activeThumbRef : undefined}
              role="tab"
              aria-selected={isActive}
              aria-label={img.alt ?? `View image ${i + 1}`}
              onClick={() => goTo(i)}
              className={`
                relative aspect-4/3 flex-none overflow-hidden rounded-lg p-0
                h-20 sm:h-24 md:h-28
                transition-[opacity,box-shadow] duration-200
                focus-visible:outline-2 focus-visible:outline-indigo-500
                ${
                  isActive
                    ? // FIX: ring-inset — no layout shift from ring
                      "opacity-100 shadow-[inset_0_0_0_2px_theme(colors.indigo.500)]"
                    : "opacity-60 hover:opacity-90"
                }
              `}
              // FIX: CSS var on container, single calc here — no per-item inline style rewrite
              style={{ width: "calc(100% / var(--thumbs-visible))" }}
            >
              <Image
                src={img.thumbnailUrl}
                alt={img.alt ?? "thumbnail"}
                fill
                // FIX: === instead of ==, and tied to activeIndex not hardcoded 0
                fetchPriority={i === activeIndex ? "high" : "low"}
                loading="lazy"
                quality={60}
                sizes="(max-width:768px) 25vw, 10vw"
                className="object-cover transition-transform duration-200 hover:scale-105"
              />
            </button>
          );
        })}
      </div>

      {/*
        FIX: <style jsx> gone. Add this to your globals.css or tailwind.config.js instead:

        globals.css:
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        tailwind.config.js extend.animation:
          'fade-in': 'fadeIn .2s ease',

        Then use: className="motion-safe:animate-fade-in"
        (motion-safe: guard respects prefers-reduced-motion automatically)
      */}
    </section>
  );
};

export default MainImageThumbnailCarousel;
