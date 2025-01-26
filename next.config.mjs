/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "groovy-ox-183.convex.cloud", // Add your Convex storage domain
        port: "",
        pathname: "/api/storage/**", // Allow all paths under /api/storage
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        port: "",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/*",
      },
    ],
  },
};

export default nextConfig;
