/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // When you request /api/...
        destination: 'https://ims-backend-pied.vercel.app/api/:path*', // Send it here
      },
    ];
  },
};

export default nextConfig;