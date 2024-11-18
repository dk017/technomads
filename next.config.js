/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['technomads.pages.dev'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/jobs',
        permanent: true,
      },
    ];
  },
  // Add this section for dynamic routes
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/companies/:company/jobs/:jobId',
          destination: '/jobs/[jobId]',
        },
      ],
    };
  },
};

module.exports = nextConfig;
