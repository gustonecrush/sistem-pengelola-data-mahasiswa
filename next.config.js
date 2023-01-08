/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BE: process.env.NEXT_PUBLIC_BE,
  },
};

module.exports = nextConfig;
