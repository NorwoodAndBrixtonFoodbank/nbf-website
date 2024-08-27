interface ServerConfig {
    environment: string;
    cloudWatch: CloudWatchConfig | null;
}

interface CloudWatchConfig {
    logGroupName: string;
    logStreamName: string;
    accessKey: string;
    secretAccessKey: string;
    logLevel: string;
}

const PROD_LIKE_ENVIRONMENTS = ["production", "staging", "dev"];

function getServerConfig(): ServerConfig {
    const environment = process.env.ENVIRONMENT;

    if (environment === undefined) {
        throw new Error("Environment name is not found in environment");
    }
    return { environment, cloudWatch: getCloudWatchConfig(environment) };
}

function getCloudWatchConfig(environment: string): CloudWatchConfig | null {
    if (!PROD_LIKE_ENVIRONMENTS.includes(environment)) {
        return null;
    }
    const logGroupName = process.env.CLOUDWATCH_LOG_GROUP;
    const logStreamName = process.env.CLOUDWATCH_LOG_STREAM;
    const accessKey = process.env.CLOUDWATCH_ACCESS_KEY;
    const secretAccessKey = process.env.CLOUDWATCH_SECRET_ACCESS_KEY;
    const logLevel = process.env.ENVIRONMENT === "production" ? "warn" : "info";

    if (!logGroupName) {
        throw new Error("CloudWatch log group name is not found in environment");
    }

    if (!logStreamName) {
        throw new Error("CloudWatch log stream name is not found in environment");
    }

    if (!accessKey) {
        throw new Error("CloudWatch access key is not found in environment");
    }

    if (!secretAccessKey) {
        throw new Error("CloudWatch secret access key is not found in environment");
    }

    return {
        logGroupName,
        logStreamName,
        accessKey,
        secretAccessKey,
        logLevel,
    };
}

const serverConfig = getServerConfig();

export default serverConfig;
