/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        return config;
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.NEXT_PUBLIC_BACKEND_URL + '/:path*'
            },
            {
                source: '/file/:path*',
                destination: process.env.S3_BUCKET + '/:path*'
            }
        ]
    }
}

module.exports = nextConfig
