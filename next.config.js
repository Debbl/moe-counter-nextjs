/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/counter/:slug*",
        destination: "/api/counter/:slug*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
