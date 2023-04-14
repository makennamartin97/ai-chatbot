/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader:"akamai",
    path:"",
    domains: [
      'https://ai-chatbot-dun.vercel.app/',
    ]
  }
}

module.exports = nextConfig
