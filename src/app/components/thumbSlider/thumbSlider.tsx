/**
 * MainImageThumbnailCarousel
 *
 * Architecture:
 *   ┌─ Server component (this file) ──────────────────────────────────┐
 *   │  Renders static HTML: <section>, aria labels, image stack       │
 *   │  Zero JS shipped for this shell itself                          │
 *   │                                                                 │
 *   │  ┌─ SliderCarousel (client boundary) ──────────────────────┐   │
 *   │  │  Owns: useState, keyboard nav, CarouselContext           │   │
 *   │  │                                                          │   │
 *   │  │  ┌─ MainImageView (client) ──────────────────────────┐  │   │
 *   │  │  │  Reads context → drives opacity on image stack    │  │   │
 *   │  │  └──────────────────────────────────────────────────┘  │   │
 *   │  │  ┌─ ThumbnailStrip (client) ─────────────────────────┐  │   │
 *   │  │  │  Renders LazyThumb × N                            │  │   │
 *   │  │  │  LazyThumb: IntersectionObserver + skeleton        │  │   │
 *   │  │  └──────────────────────────────────────────────────┘  │   │
 *   │  └──────────────────────────────────────────────────────────┘   │
 *   └─────────────────────────────────────────────────────────────────┘
 */

import { AriaLiveRegion, ThumbnailStrip } from "./thumbnailStrip";
import SliderCarousel from "./slideCarousel";
import MainImageView from "./mainImage";
import { MainImageThumbnailCarouselProps } from "@/src/types/craousel";

// This component itself has NO "use client" directive →
// Next.js treats it as a React Server Component.
// Client boundary is pushed down to SliderCarousel.

const MainImageThumbnailCarousel: React.FC<MainImageThumbnailCarouselProps> = ({
  images,
  initialIndex = 0,
  className = "",
  thumbsVisible = 5,
  countVisible = false,
}) => {
  if (!images.length) return null;

  const safeInitial = Math.max(0, Math.min(initialIndex, images.length - 1));

  return (
    <section
      aria-label="Image gallery"
      className={`mx-auto flex w-full max-w-225 flex-col gap-3 ${className}`}
    >
      {/*
        SliderCarousel is the ONLY client boundary.
        Everything inside it can use hooks/state.
        Everything outside (this <section> tag) is pure SSR HTML.
      */}
      <SliderCarousel total={images.length} initialIndex={safeInitial}>
        {/* Main image stage */}
        <MainImageView images={images} countVisible={countVisible} />

        {/*
          Screen-reader live region — outside MainImageView so it
          doesn't interfere with role="img" on the stage div.
          Rendered server-side; text is updated client-side via context.
        */}
        <AriaLiveRegion images={images} />

        {/* Thumbnail strip */}
        <ThumbnailStrip images={images} thumbsVisible={thumbsVisible} />
      </SliderCarousel>
    </section>
  );
};

export default MainImageThumbnailCarousel;

// ─────────────────────────────────────────────────────────────────────────────
// AriaLiveRegion — tiny client component for SR announcements
// ─────────────────────────────────────────────────────────────────────────────

// Kept in this file to avoid a separate file for a 10-line component.
// "use client" is scoped to this component only (Next.js 13+ supports this
// via the fact that a file can export multiple components, but only those
// imported into a client boundary need "use client" at their file level).
//
// Realistically: move this to its own file `AriaLiveRegion.tsx` with "use client"
// if your linter requires one directive per file.
