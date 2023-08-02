/** @type {import("next").NextConfig} */

const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    experimental: {
        newNextLinkBehavior: true,
    },
};

module.exports = nextConfig;
