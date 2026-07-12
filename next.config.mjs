/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dribbble.com',
      },
      {
        protocol: 'https',
        hostname: 's3-alpha.figma.com',
      },
      {
        protocol: 'https',
        hostname: 'devshohag.netlify.app',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
};

export default nextConfig;
