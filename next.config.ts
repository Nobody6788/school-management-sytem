import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  swcMinify: false,
  reactStrictMode: false,
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ['react-day-picker'],
  },
};

export default nextConfig;
