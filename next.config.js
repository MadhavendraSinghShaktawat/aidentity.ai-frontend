/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [], // Add any image domains you need here
    },
    // Ensure experimental features are enabled if needed
    experimental: {
        // Add any experimental features you need
    },
};

module.exports = nextConfig; 