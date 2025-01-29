/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rabltqwnbbaymaemuvoo.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  rewrites: async () => [{
    source: "/sitemap-:id.xml",
    destination: "/sitemap.xml/:id",
  },],
};


module.exports = nextConfig;
