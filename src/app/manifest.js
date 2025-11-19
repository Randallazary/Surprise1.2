export default function manifest() {
  return {
    name: "Surprise App",
    short_name: "Surprise",
    description: "Mi aplicación PWA con Next 14.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/logo-actual.png",
        sizes: "192x192",
        type: "logo-actual/png",
      },
      {
        src: "/logo-actual.png",
        sizes: "512x512",
        type: "logo-actual/png",
      },
    ],
  };
}