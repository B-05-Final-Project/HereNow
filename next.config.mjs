/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'tong.visitkorea.or.kr',
      },
    ],
  },
};

export default nextConfig;
