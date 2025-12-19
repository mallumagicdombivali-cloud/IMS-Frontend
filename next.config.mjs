/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ims-backend-pied.vercel.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;