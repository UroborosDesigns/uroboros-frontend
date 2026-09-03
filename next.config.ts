import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["uroboros-types"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
    // Cloudinary already serves optimized/responsive variants (f_auto,q_auto
    // transforms), so skip Vercel's own image-optimization quota entirely.
    unoptimized: true,
  },
};

export default nextConfig;
