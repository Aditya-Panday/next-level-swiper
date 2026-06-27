"use client";

import { MainImageThumbnailCarouselProps } from "@/src/types/craousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
      className={`mitc-root ${className}`}
      aria-label="Image gallery"
      role="region"
    >
      {/* ── Main Image ─────────────────────────────────────────────────────── */}
      <div
        className="mitc-main"
        onKeyDown={handleMainKeyDown}
        tabIndex={0}
        role="img"
        aria-label={
          active?.alt ?? `Image ${activeIndex + 1} of ${images.length}`
        }
      >
        {images.map((img, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={img.id}
            src={img.mainUrl}
            alt={img.alt ?? `Gallery image ${i + 1}`}
            className={`mitc-main__img ${
              i === activeIndex
                ? isTransitioning
                  ? "mitc-main__img--exit"
                  : "mitc-main__img--active"
                : "mitc-main__img--hidden"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}

        {/* Prev / Next overlays */}
        <button
          className="mitc-nav mitc-nav--prev"
          onClick={prev}
          aria-label="Previous image"
        >
          <ArrowLeft />
        </button>
        <button
          className="mitc-nav mitc-nav--next"
          onClick={next}
          aria-label="Next image"
        >
          <ArrowRight />
        </button>

        {/* Counter badge */}
        {countVisible && (
          <span className="mitc-counter" aria-hidden="true">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* ── Thumbnail Strip ────────────────────────────────────────────────── */}
      <div
        className="mitc-thumbs"
        // role="tablist"
        aria-label="Image thumbnails"
        style={{ "--thumbs-visible": thumbsVisible } as React.CSSProperties}
      >
        <div ref={thumbTrackRef} className="mitc-thumbs__track">
          {images.map((img, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={img.id}
                ref={isActive ? activeThumbRef : undefined}
                role="tab"
                aria-selected={isActive}
                aria-label={img.alt ?? `View image ${i + 1}`}
                className={`mitc-thumb ${isActive ? "mitc-thumb--active" : ""}`}
                onClick={() => goTo(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.thumbnailUrl}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="mitc-thumb__img"
                />
                {isActive && (
                  <span className="mitc-thumb__ring" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        /* ── Root ──────────────────────────────────────────────────────────── */
        .mitc-root {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-family: inherit;
        }

        /* ── Main image area ───────────────────────────────────────────────── */
        .mitc-main {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: #0f172a;
          border-radius: 14px;
          overflow: hidden;
          outline: none;
        }

        .mitc-main:focus-visible {
          box-shadow: 0 0 0 3px #6366f1;
        }

        .mitc-main__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.18s ease;
        }

        .mitc-main__img--active  { opacity: 1; z-index: 1; }
        .mitc-main__img--exit    { opacity: 0; z-index: 1; }
        .mitc-main__img--hidden  { opacity: 0; z-index: 0; }

        /* ── Prev/Next nav ─────────────────────────────────────────────────── */
        .mitc-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,.85);
          backdrop-filter: blur(6px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, transform 0.15s;
          color: #111;
        }

        .mitc-nav svg { width: 20px; height: 20px; }

        .mitc-nav--prev { left: 12px; }
        .mitc-nav--next { right: 12px; }

        .mitc-nav:hover {
          background: #fff;
          transform: translateY(-50%) scale(1.08);
        }

        .mitc-nav:focus-visible {
          outline: 3px solid #6366f1;
          outline-offset: 2px;
        }

        /* ── Counter ───────────────────────────────────────────────────────── */
        .mitc-counter {
          position: absolute;
          bottom: 12px;
          right: 14px;
          z-index: 10;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          background: rgba(0,0,0,.45);
          backdrop-filter: blur(4px);
          padding: 3px 9px;
          border-radius: 20px;
          letter-spacing: .04em;
        }

        /* ── Thumbnail strip ───────────────────────────────────────────────── */
        .mitc-thumbs {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .mitc-thumbs__track {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          padding: 4px 2px; /* room for ring outline */
        }

        .mitc-thumbs__track::-webkit-scrollbar { display: none; }

        /* ── Individual thumb ──────────────────────────────────────────────── */
        .mitc-thumb {
          position: relative;
          flex: 0 0 calc(100% / var(--thumbs-visible, 5) - 8px * (var(--thumbs-visible, 5) - 1) / var(--thumbs-visible, 5));
          aspect-ratio: 4/3;
          scroll-snap-align: start;
          border: none;
          padding: 0;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          background: #e5e7eb;
          transition: opacity 0.15s;
        }

        .mitc-thumb:not(.mitc-thumb--active) { opacity: 0.55; }
        .mitc-thumb:hover:not(.mitc-thumb--active) { opacity: 0.82; }

        .mitc-thumb:focus-visible {
          outline: 3px solid #6366f1;
          outline-offset: 2px;
        }

        .mitc-thumb__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.2s ease;
        }

        .mitc-thumb:hover .mitc-thumb__img { transform: scale(1.04); }

        .mitc-thumb__ring {
          position: absolute;
          inset: 0;
          border-radius: 8px;
          box-shadow: inset 0 0 0 2.5px #6366f1;
          pointer-events: none;
          z-index: 2;
        }

        /* ── Responsive ────────────────────────────────────────────────────── */
        @media (max-width: 640px) {
          .mitc-nav { width: 32px; height: 32px; }
          .mitc-nav svg { width: 16px; height: 16px; }
        }

        /* ── Reduced motion ────────────────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .mitc-main__img,
          .mitc-thumb__img,
          .mitc-nav { transition: none; }
        }
      `}</style>
    </section>
  );
};

export default MainImageThumbnailCarousel;
