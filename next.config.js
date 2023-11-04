/** @type {import("next").NextConfig} */

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

module.exports = nextConfig;
