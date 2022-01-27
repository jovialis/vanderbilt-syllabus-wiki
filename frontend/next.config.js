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
                source: '/file/:path*',
                destination: 'https://syllabus-wiki-uploads.s3.us-east-2.amazonaws.com/public/:path*'
            }
        ]
    }
}

module.exports = nextConfig
