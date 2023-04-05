/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/counter/:path*",
        destination: "/api/counter/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
