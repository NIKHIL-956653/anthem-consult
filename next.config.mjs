/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // three.js is only pulled into the client bundle by the lazily loaded scene chunk.
  transpilePackages: ['three'],
  experimental: {
    optimizePackageImports: ['@react-three/drei'],
  },
};

export default nextConfig;
