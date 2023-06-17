import winston from "winston";
import "winston-daily-rotate-file";

const customLevel = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "blue",
    debug: "magenta",
  },
};

winston.addColors(customLevel.colors);

const rotateFileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss" }),
  winston.format.prettyPrint()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(
    ({ level, message, timestamp, ...meta }) =>
      `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""}`
  )
);

const transports = [
  new winston.transports.Console({ format: consoleFormat }),
  new winston.transports.DailyRotateFile({
    format: rotateFileFormat,
    maxFiles: "7d",
    level: "error",
    dirname: `${process.cwd()}/logs`,
    datePattern: "YYYY-MM-DD",
    filename: "%DATE%-error.log",
  }),
];

const logger = winston.createLogger({
  level: process.env.NODE_ENV !== "production" ? "debug" : "warn",
  levels: customLevel.levels,
  transports,
});

export default logger;
