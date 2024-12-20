/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // 启用严格模式
  swcMinify: true, // 使用 SWC 编译器进行最小化
  images: {
    domains: ["ipfs.io"], // 允许从 IPFS 或其他域加载图片
  },
  experimental: {
    appDir: true, // 启用 App Router 支持
  },
  env: {
    NEXT_PUBLIC_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID, // 公开的环境变量
  },
};

module.exports = nextConfig;
