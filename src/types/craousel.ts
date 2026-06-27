export interface CarouselImage {
  id: string;
  mainUrl: string;
  thumbnailUrl: string;
  alt?: string;
}

export interface MainImageThumbnailCarouselProps {
  images: CarouselImage[];
  initialIndex?: number;
  className?: string;
  thumbsVisible?: number;
  countVisible?: boolean;
}
