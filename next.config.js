/** @type {import("next").NextConfig} */

import createBundleAnalyzerWrapper from "@next/bundle-analyzer";

const withBundleAnalyzer = createBundleAnalyzerWrapper({
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
