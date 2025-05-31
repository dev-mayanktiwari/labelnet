import util from "util";
import dayjs from "dayjs";
import path from "path";
import "winston-mongodb";
import { blue, green, magenta, red, yellow } from "colorette";
import {
  ConsoleTransportInstance,
  FileTransportInstance,
} from "winston/lib/winston/transports";
import { createLogger, transports, format } from "winston";
import { MongoDBTransportInstance } from "winston-mongodb";
import { ApplicationEnvironment } from "@workspace/constants";
import dotenv from "dotenv";
dotenv.config();

const colorizeLevel = (level: string): string => {
  switch (level) {
    case "ERROR":
      return red(level);
    case "warn":
      return yellow(level);
    case "INFO":
      return blue(level);

    default:
      return level;
  }
};

const consoleLogFormat = format.printf((info) => {
  const { level, timestamp, message, meta = {} } = info;
  const customLevel = colorizeLevel(level.toUpperCase());
  const customTimestamp = green(
    dayjs(timestamp as string).format("YYYY-MM-DD HH:mm:ss")
  );
  const customMessage = message;
  const customMeta = util.inspect(meta, {
    showHidden: false,
    depth: null,
    colors: true,
  });
  const customLog = `${customLevel} - ${customTimestamp} - ${customMessage}\n${magenta(`META`)} ${customMeta}\n`;

  return customLog;
});

const fileLogFormat = format.printf((info) => {
  const { level, timestamp, message, meta = {} } = info;
  const logMeta: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(meta as Record<string, unknown>)) {
    if (value instanceof Error) {
      logMeta[key] = [
        {
          name: value.name,
          message: value.message,
          trace: value.stack || "",
        },
      ];
    } else {
      logMeta[key] = value;
    }
  }
  const logData = {
    level: level.toUpperCase(),
    timestamp: dayjs(timestamp as string).format("YYYY-MM-DD HH:mm:ss"),
    message,
    meta: logMeta,
  };
  return JSON.stringify(logData, null, 2);
});

const consoleTransport = (): Array<ConsoleTransportInstance> => {
  // console.log("Console logger");
  if (process.env.NODE_ENV === ApplicationEnvironment.DEVELOPMENT) {
    return [
      new transports.Console({
        level: "info",
        format: format.combine(format.timestamp(), consoleLogFormat),
      }),
    ];
  }
  return [];
};

const mongoTransport = (): Array<MongoDBTransportInstance> => {
  if (process.env.NODE_ENV === ApplicationEnvironment.PRODUCTION) {
    return [
      new transports.MongoDB({
        level: "info",
        db: process.env.MONGO_URL as string,
        expireAfterSeconds: 60 * 60 * 24 * 7, // 7 days
      }),
    ];
  }
  return [];
};

const fileTransport = (): Array<FileTransportInstance> => {
  return [
    new transports.File({
      filename: path.join(
        __dirname,
        `../../../logs/${process.env.NODE_ENV}.log`
      ),
      level: "info",
      format: format.combine(format.timestamp(), fileLogFormat),
    }),
  ];
};

export const logger = createLogger({
  defaultMeta: {
    meta: {},
  },
  transports: [...fileTransport(), ...consoleTransport(), ...mongoTransport()],
});
