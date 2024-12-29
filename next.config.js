/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['technomads.pages.dev', 'onlyremotejobs.me']
  },
};

module.exports = nextConfig;
