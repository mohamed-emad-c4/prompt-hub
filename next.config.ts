import 'dotenv/config';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ✅ تجاهل أخطاء ESLint أثناء الـ build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
