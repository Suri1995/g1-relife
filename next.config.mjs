/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mybusinessweb.in",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "mybusinessweb.in",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
