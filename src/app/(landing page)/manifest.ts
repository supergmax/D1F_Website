import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "With Us Associates",
    short_name: "With Us",
    description: "Challenge yourself without limits",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4E463F",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  }
}
