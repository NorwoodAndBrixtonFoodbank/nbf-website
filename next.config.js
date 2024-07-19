/** @type {import("next").NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    experimental: {
        newNextLinkBehavior: true,
        serverActions: true,
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/parcels",
                permanent: false,
            },
        ];
    },
};

module.exports = withBundleAnalyzer(nextConfig);
