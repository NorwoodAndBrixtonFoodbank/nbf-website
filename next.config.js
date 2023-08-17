/** @type {import("next").NextConfig} */

const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    experimental: {
        newNextLinkBehavior: true,
        serverActions: true,
    },
};

module.exports = nextConfig;
