"use client";

import React, {
  createContext,
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

interface CarouselContextValue {
  activeIndex: number;
  total: number;
  goTo: (index: number) => void;
  prev: () => void;
  next: () => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarousel(): CarouselContextValue {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel must be used inside <SliderCarousel>");
  return ctx;
}

// ─────────────────────────────────────────────
// SliderCarousel — client boundary wrapper
// ─────────────────────────────────────────────

interface SliderCarouselProps {
  total: number;
  initialIndex?: number;
  children: React.ReactNode;
  /** Called on every index change — useful for analytics / URL sync */
  onIndexChange?: (index: number) => void;
}

export default function SliderCarousel({
  total,
  initialIndex = 0,
  children,
  onIndexChange,
}: SliderCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, Math.min(initialIndex, total - 1)),
  );

  // Stable goTo — wraps with modulo so callers don't need to think about bounds
  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((prev) => {
        const next = ((index % total) + total) % total;
        return next !== prev ? next : prev;
      });
    },
    [total],
  );

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Fire external callback without it being a dep of goTo
  useEffect(() => {
    onIndexChange?.(activeIndex);
  }, [activeIndex, onIndexChange]);

  // Keyboard on the outer container (arrow keys for main image)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    },
    [prev, next],
  );

  return (
    <CarouselContext.Provider value={{ activeIndex, total, goTo, prev, next }}>
      {/*
        tabIndex on this div makes arrow-key nav work when the user
        focuses anywhere inside the carousel. The inner main-image div
        also has tabIndex for fine-grained focus, but this catches
        thumbnail-focused state too.
      */}
      <div
        onKeyDown={handleKeyDown}
        // Not tabIndex=0 itself — individual interactive elements are
        // focusable; this is purely for delegated keyboard capture.
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}
