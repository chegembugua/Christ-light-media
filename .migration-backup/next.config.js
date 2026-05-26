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
        hostname: '**.supabase.co', // for when you upload images to Supabase storage
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // for Google profile pictures
      },
    ],
  },
};

module.exports = nextConfig;
