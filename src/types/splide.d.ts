// Global type declarations for Splide loaded via CDN
declare global {
  interface Window {
    Splide: typeof import('@splidejs/splide').Splide;
  }

  const Splide: typeof import('@splidejs/splide').Splide;
}

export {};
