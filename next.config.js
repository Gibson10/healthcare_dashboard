/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'omnihealthcare.s3.amazonaws.com',
        pathname: '/**', // Allow all paths from this domain
      },
      {
        protocol: 'https',
        hostname: 'png.pngtree.com',
        pathname: '/**', // Allow all paths from this domain
      },
    ],
  },
};

module.exports = nextConfig;
