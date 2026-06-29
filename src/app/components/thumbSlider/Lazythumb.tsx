"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCarousel } from "./slideCarousel";

interface LazyThumbProps {
  index: number;
  src: string;
  alt: string;
  /** Width fraction of thumbnail strip. e.g. "calc(100% / 5)" */
  widthStyle: string;
  /** Extra className forwarded to the button */
  className?: string;
}

export default function LazyThumb({
  index,
  src,
  alt,
  widthStyle,
  className = "",
}: LazyThumbProps) {
  const { activeIndex, goTo } = useCarousel();
  const isActive = index === activeIndex;

  const btnRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // ── IntersectionObserver ──────────────────────────────────────
  // Fires once when thumbnail button scrolls into the viewport.
  // After that, the observer is disconnected — no repeated work.
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    // Already loaded in a previous render (e.g. if component remounts)
    if (visible) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      {
        // Expand the root margin so images 200px outside viewport start loading
        // slightly before the user actually sees them → instant feel on scroll
        rootMargin: "0px 200px 0px 200px",
        threshold: 0,
      },
    );

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Scroll active thumb into view ────────────────────────────
  useEffect(() => {
    if (isActive) {
      btnRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [isActive]);

  const handleClick = useCallback(() => goTo(index), [goTo, index]);

  return (
    <button
      ref={btnRef}
      role="tab"
      aria-selected={isActive}
      aria-label={alt || `View image ${index + 1}`}
      onClick={handleClick}
      style={{ width: widthStyle }}
      className={[
        // Layout
        "relative aspect-4/3 flex-none overflow-hidden rounded-lg p-0",
        "h-20 sm:h-24 md:h-28",
        // Interaction transitions
        "transition-[opacity,box-shadow] duration-200",
        "focus-visible:outline-2 focus-visible:outline-indigo-500",
        // Active state uses inset ring → zero layout shift
        isActive
          ? "opacity-100 shadow-[inset_0_0_0_2px_theme(colors.indigo.500)]"
          : "opacity-60 hover:opacity-90",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Skeleton / Loader ──────────────────────────────────── */}
      {/*
        Shown until:
          1) thumb enters the viewport (visible=false → IO pending)
          2) the <Image> has fired onLoad (loaded=false → network pending)

        The skeleton is always in the DOM (position:absolute) so it
        doesn't cause layout shift when it disappears.
      */}
      <span
        aria-hidden="true"
        className={[
          "absolute inset-0 z-10",
          "bg-slate-800 dark:bg-slate-700",
          // Shimmer animation via CSS — no JS needed
          "after:absolute after:inset-0 after:translate-x-[-100%]",
          "after:bg-gradient-to-r after:from-transparent",
          "after:via-white/10 after:to-transparent",
          "after:animate-[shimmer_1.4s_ease-in-out_infinite]",
          // Fade out once image is loaded
          "transition-opacity duration-300",
          loaded ? "opacity-0 pointer-events-none" : "opacity-100",
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {/* ── Actual Thumbnail ───────────────────────────────────── */}
      {/*
        Rendered only once IO fires (visible=true).
        This prevents the browser from requesting the image until needed.
        The <Image> itself still uses loading="lazy" as a second safety net.
      */}
      {visible && (
        <Image
          src={src}
          alt={alt || "thumbnail"}
          fill
          loading="lazy"
          fetchPriority={isActive ? "high" : "low"}
          quality={60}
          sizes="(max-width:768px) 25vw, 10vw"
          onLoad={() => setLoaded(true)}
          className={[
            "object-cover",
            "transition-[transform,opacity] duration-300",
            "hover:scale-105",
            // Fade in once loaded
            loaded ? "opacity-100" : "opacity-0",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      )}
    </button>
  );
}
