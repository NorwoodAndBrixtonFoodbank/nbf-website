"use server";

import winston, { createLogger, format, Logger } from "winston";
import WinstonCloudwatch from "winston-cloudwatch";
import { serverConfig } from "@/server/serverConfig";
import { v4 as uuid } from "uuid";

const logger = getLogger();

type LogEvent = (message: string, meta?: Record<string, any>) => Promise<string | void>;

export const logError: LogEvent = (message, meta) => {
    const id = uuid();
    logger.error(message, id, meta);
    return Promise.resolve(id);
};

export const logWarning: LogEvent = (message, meta) => {
    const id = uuid();
    logger.warn(message, id, meta);
    return Promise.resolve();
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
