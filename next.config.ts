import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",  // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // If deploying to a custom domain, leave basePath empty.
  // If deploying to https://<user>.github.io/<repo>, uncomment the line below:
  basePath: process.env.NODE_ENV === "production" ? "/lumos" : "",
};

export default nextConfig;
