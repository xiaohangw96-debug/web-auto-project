/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/web-auto-project/wordsite',
  assetPrefix: '/web-auto-project/wordsite',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
}

module.exports = nextConfig
