/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/actions.json",
        has: [
          {
            type: "query",
            key: "uid",
          },
        ],
        destination: "/api/get-actions?uid=:uid",
      },
      { source: "/api/(.*)", destination: "/api" },
    ];
  },
};

module.exports = nextConfig;
