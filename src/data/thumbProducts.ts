type CardData = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  tag: string;
};

export const CARDS_DATA: CardData[] = [
  {
    id: 1,
    title: "Stripe Integration",
    content:
      "End-to-end payment flow with webhook verification, idempotency keys, and HMAC-SHA256 signature validation for secure server-side processing.",
    imageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80",
    tag: "Payments",
  },
  {
    id: 2,
    title: "Razorpay Orders API",
    content:
      "Create orders server-side, capture payments client-side, and verify signatures with the standard create → pay → verify three-step flow.",
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    tag: "Payments",
  },
  {
    id: 3,
    title: "PhonePe UPI",
    content:
      "Redirect-based UPI checkout using the PhonePe PG SDK. Handles deep-links, payment status polling, and server callback verification.",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
    tag: "UPI",
  },
  {
    id: 4,
    title: "Cashfree Payouts",
    content:
      "Automated bulk payouts to vendors via Cashfree's Payouts API, with beneficiary management and real-time transfer status webhooks.",
    imageUrl:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=600&q=80",
    tag: "Payouts",
  },
  {
    id: 5,
    title: "Klarna BNPL",
    content:
      "Buy-now-pay-later integration with Klarna's Payments API. Handles session creation, customer authentication, and order capture.",
    imageUrl:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&q=80",
    tag: "BNPL",
  },
  {
    id: 6,
    title: "Amazon Pay",
    content:
      "One-click checkout using stored Amazon wallets. Integrates the Amazon Pay JS widget with server-side charge confirmation.",
    imageUrl:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80",
    tag: "Wallets",
  },
];

type CarouselImage = {
  id: string;
  mainUrl: string;
  thumbnailUrl: string;
  alt: string;
};

export const GALLERY_IMAGES: CarouselImage[] = [
  {
    id: "img1",
    mainUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=85",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&q=70",
    alt: "Stripe payment integration dashboard",
  },
  {
    id: "img2",
    mainUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=85",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&q=70",
    alt: "Point of sale terminal",
  },
  {
    id: "img3",
    mainUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=85",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&q=70",
    alt: "Stock market analytics screen",
  },
  {
    id: "img4",
    mainUrl:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=1200&q=85",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=200&q=70",
    alt: "Currency and finances",
  },
  {
    id: "img51",
    mainUrl:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1200&q=85",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=200&q=70",
    alt: "Mobile payment app",
  },
  {
    id: "img622",
    mainUrl:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=85",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=70",
    alt: "E-commerce shopping experience",
  },
  {
    id: "img522",
    mainUrl:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1200&q=85",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=200&q=70",
    alt: "Mobile payment app",
  },
  {
    id: "img61",
    mainUrl:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=85",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=70",
    alt: "E-commerce shopping experience",
  },
  {
    id: "img52",
    mainUrl:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1200&q=85",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=200&q=70",
    alt: "Mobile payment app",
  },
  {
    id: "img63",
    mainUrl:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=85",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=70",
    alt: "E-commerce shopping experience",
  },
];
