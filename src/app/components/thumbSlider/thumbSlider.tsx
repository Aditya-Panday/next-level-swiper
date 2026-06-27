"use client";

import { MainImageThumbnailCarouselProps } from "@/src/types/craousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  KeyboardEvent,
} from "react";

// ─── Component ────────────────────────────────────────────────────────────────

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const thumbTrackRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);

  const active = images[activeIndex];

  // ── Navigation ──────────────────────────────────────────────────────────────

  const goTo = useCallback(
    (index: number) => {
      const clamped = (index + images.length) % images.length;
      if (clamped === activeIndex) return;

      setIsTransitioning(true);
      // Let CSS fade out complete, then swap
      setTimeout(() => {
        setActiveIndex(clamped);
        setIsTransitioning(false);
      }, 180);
    },
    [activeIndex, images.length],
  );

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Keyboard on main image
  const handleMainKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    },
    [prev, next],
  );

  // ── Scroll active thumb into view ────────────────────────────────────────────

  useEffect(() => {
    const thumb = activeThumbRef.current;
    const track = thumbTrackRef.current;
    if (!thumb || !track) return;
    const { offsetLeft, offsetWidth } = thumb;
    const { scrollLeft, offsetWidth: trackWidth } = track;
    if (offsetLeft < scrollLeft) {
      track.scrollTo({ left: offsetLeft, behavior: "smooth" });
    } else if (offsetLeft + offsetWidth > scrollLeft + trackWidth) {
      track.scrollTo({
        left: offsetLeft + offsetWidth - trackWidth,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  if (!images.length) return null;

  return (
    <section
      className={`w-full max-w-225 mx-auto flex flex-col gap-3 font-inherit ${className}`}
      aria-label="Image gallery"
      role="region"
    >
      {/* ── Main Image ─────────────────────────────────────────────────────── */}
      <div
        className="relative w-full aspect-video bg-slate-950 rounded-sm overflow-hidden outline-none focus-visible:[box-shadow:0_0_0_3px_#6366f1]"
        onKeyDown={handleMainKeyDown}
        tabIndex={0}
        role="img"
        aria-label={
          active?.alt ?? `Image ${activeIndex + 1} of ${images.length}`
        }
      >
        {images.map((img, i) => (
          <Image
            key={img.id}
            src={img.mainUrl}
            alt={img.alt ?? `Gallery image ${i + 1}`}
            fetchPriority={i === activeIndex ? "high" : "auto"}
            className={`absolute inset-0 w-full h-full object-cover ${
              i === activeIndex
                ? isTransitioning
                  ? "opacity-0 z-10 transition-opacity duration-200 ease-in-out"
                  : "opacity-100 z-10"
                : "opacity-0 z-0 transition-opacity duration-200 ease-in-out"
            }`}
            loading={i === activeIndex ? "eager" : "lazy"}
            priority={i === activeIndex}
            fill
            sizes="(max-width: 900px) 100vw, 900px"
          />
        ))}

        {/* Prev / Next overlays */}
        <button
          className="absolute top-1/2 left-3 -translate-y-1/2 z-10 w-10 h-10 rounded-full border-none bg-white/85 backdrop-blur-sm text-slate-900 transition duration-150 ease-in-out flex items-center justify-center hover:bg-white hover:scale-[1.08] focus-visible:outline-3 focus-visible:outline-[#6366f1] max-sm:w-8 max-sm:h-8"
          onClick={prev}
          aria-label="Previous image"
        >
          <ArrowLeft className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
        </button>
        <button
          className="absolute top-1/2 right-3 -translate-y-1/2 z-10 w-10 h-10 rounded-full border-none bg-white/85 backdrop-blur-sm text-slate-900 transition duration-150 ease-in-out flex items-center justify-center hover:bg-white hover:scale-[1.08] focus-visible:outline-3 focus-visible:outline-[#6366f1] max-sm:w-8 max-sm:h-8"
          onClick={next}
          aria-label="Next image"
        >
          <ArrowRight className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
        </button>

        {/* Counter badge */}
        {countVisible && (
          <span
            className="absolute bottom-3 right-3 z-10 text-[12px] font-semibold text-white bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-full tracking-[0.04em]"
            aria-hidden="true"
          >
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* ── Thumbnail Strip ────────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        aria-label="Image thumbnails"
      >
        <div
          ref={thumbTrackRef}
          className="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory px-1"
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
                className={`relative snap-start flex-none basis-[calc(100%/${thumbsVisible}-1.6rem)] aspect-4/2 lg:aspect-4/3 border-none p-0 rounded-lg overflow-hidden cursor-pointer bg-slate-200 transition-opacity duration-150 ease-in-out ${
                  isActive ? "opacity-100" : "opacity-60 hover:opacity-80"
                } focus-visible:outline-3 focus-visible:outline-[#6366f1]`}
              >
                <img
                  src={img.thumbnailUrl}
                  alt="text-img"
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover block transition-transform duration-200 ease-in-out hover:scale-[1.04]"
                />
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-lg shadow-[inset_0_0_0_2.5px_#6366f1] pointer-events-none z-20"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MainImageThumbnailCarousel;
