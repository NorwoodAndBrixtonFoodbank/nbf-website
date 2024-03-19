interface ServerConfig {
    cloudWatch: CloudWatchConfig;
}

interface CloudWatchConfig {
    logGroupName: string;
    logStreamName: string;
    accessKey: string;
    secretAccessKey: string;
}

export const serverConfig: ServerConfig = {
    cloudWatch: getCloudWatchConfig(),
};

function getCloudWatchConfig(): CloudWatchConfig {
    const logGroupName = process.env.CLOUDWATCH_LOG_GROUP;
    const logStreamName = process.env.CLOUDWATCH_LOG_STREAM;
    const accessKey = process.env.CLOUDWATCH_ACCESS_KEY;
    const secretAccessKey = process.env.CLOUDWATCH_SECRET_ACCESS_KEY;

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
    };
}
