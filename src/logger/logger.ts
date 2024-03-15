"use server";

import winston, { createLogger, format, Logger } from "winston";
import WinstonCloudwatch from "winston-cloudwatch";
import { serverConfig } from "@/server/serverConfig";
import { v4 as uuid } from "uuid";

const logger = getLogger();

type LogEvent = (message: string, meta?: Record<string, any>) => Promise<void>;
type LogEventWithId = (message: string, meta?: Record<string, any>) => Promise<string>;

export const logError: LogEventWithId = (message, meta) => {
    const errorId = uuid();
    logger.error(message, errorId, meta);
    return Promise.resolve(errorId);
};

export const logWarning: LogEventWithId = (message, meta) => {
    const errorId = uuid();
    logger.warn(message, errorId, meta);
    return Promise.resolve(errorId);
};

export const logInfo: LogEvent = (message, meta) => {
    logger.info(message, meta);
    return Promise.resolve();
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
