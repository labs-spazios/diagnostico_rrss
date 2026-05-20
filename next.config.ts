
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
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        // Esta configuración debería permitir imágenes desde tu bucket.
        pathname: '/v0/b/dueo-test-24684.appspot.com/o/**', 
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // Domain for ibb.co images
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xn--somosmasdueos-skb.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ["https://6000-firebase-studio-1747010929932.cluster-m7tpz3bmgjgoqrktlvd4ykrc2m.cloudworkstations.dev"],
  },
};

export default nextConfig;
