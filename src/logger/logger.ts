"use server";

import winston, { createLogger, format, Logger } from "winston";
import WinstonCloudwatch from "winston-cloudwatch";

import * as dotenv from "dotenv";
import { serverConfig } from "@/server/serverConfig";

dotenv.config({ path: "./.env.local" });

const logger = getLogger();

type LogEvent = (message: string, meta: Record<string, any>) => Promise<void>;

export const logError: LogEvent = (message, meta): Promise<void> => {
    logger.error(message, meta);
    return Promise.resolve();
};

export const logWarning: LogEvent = (message, meta): Promise<void> => {
    logger.warn(message, meta);
    return Promise.resolve();
};

export const logInfo: LogEvent = (message, meta): Promise<void> => {
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
