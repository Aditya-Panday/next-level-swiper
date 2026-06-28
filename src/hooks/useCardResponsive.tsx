"use client";

import { useEffect, useState } from "react";

interface CarouselResponsiveConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

const defaultConfig: CarouselResponsiveConfig = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
};

export function useCarouselResponsive(
  config: Partial<CarouselResponsiveConfig> = {},
) {
  const mergedConfig = { ...defaultConfig, ...config };
  const [cardsPerView, setCardsPerView] = useState(mergedConfig.desktop);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCardsPerView(mergedConfig.mobile);
      } else if (width < 1024) {
        setCardsPerView(mergedConfig.tablet);
      } else {
        setCardsPerView(mergedConfig.desktop);
      }
    };

    // Set initial value
    handleResize();

    // Add resize listener with debounce
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [mergedConfig.mobile, mergedConfig.tablet, mergedConfig.desktop]);

  return { cardsPerView, mounted };
}
