"use server";

import winston, { createLogger, format, Logger } from "winston";
import WinstonCloudwatch from "winston-cloudwatch";
import { serverConfig } from "@/server/serverConfig";
import { v4 as uuid } from "uuid";

const logger = getLogger();

type LogEvent = (message: string, meta?: Record<string, unknown>, error?: Error) => Promise<string>;

export const logErrorReturnLogId: LogEvent = (message, meta, error) => {
    const logId = uuid();
    logger.error(message, { ...meta, logId, error: JSON.stringify(error) });
    return Promise.resolve(logId);
};

export const logWarningReturnLogId: LogEvent = (message, meta) => {
    const logId = uuid();
    logger.warn(message, { ...meta, logId });
    return Promise.resolve(logId);
};

export const logInfoReturnLogId: LogEvent = (message, meta) => {
    const logId = uuid();
    logger.info(message, { ...meta, logId });
    return Promise.resolve(logId);
};

function getLogger(): Logger {
    const cloudWatchConfig = serverConfig.cloudWatch;

    return createLogger({
        format: format.json(),
        transports: [
            new WinstonCloudwatch({
                level: "warn",
                jsonMessage: true,
                logGroupName: cloudWatchConfig.logGroupName,
                logStreamName: cloudWatchConfig.logStreamName,
                awsOptions: {
                    credentials: {
                        accessKeyId: cloudWatchConfig.accessKey,
                        secretAccessKey: cloudWatchConfig.secretAccessKey,
                    },
                    region: "eu-west-2",
                },
            }),
            new winston.transports.Console({
                level: "info",
                format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
            }),
        ],
    });
}
