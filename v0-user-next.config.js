/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    HUGGINGFACE_TOKEN: process.env.HUGGINGFACE_TOKEN,
  },
}

module.exports = nextConfig

