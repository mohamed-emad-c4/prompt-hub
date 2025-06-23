import 'dotenv/config';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ✅ تجاهل أخطاء ESLint أثناء الـ build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  // Configure for Cloudflare Pages
  swcMinify: true,
};

export default nextConfig;
