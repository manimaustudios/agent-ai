/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
