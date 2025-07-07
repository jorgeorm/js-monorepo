// Copyright (c) 2024, jorgeorm@gmail.com
// All rights reserved.
import pino from 'pino';
import { DependencyInitializationError } from './errors';

/**
 * Logger module for the Restify application.
 * This module provides a logger factory that can create loggers of different types.
 * Currently, it supports a default console logger and a Pino logger.
 */

/**
 * Logger type that defines the methods available for logging.
 */
type Logger = {
  info: (message: string, obj?: unknown) => void;
  error: (message: string, err?: Error) => void;
  debug: (message: string, obj?: unknown) => void;
  fatal: (message: string, obj?: unknown) => void;
  trace: (message: string, obj?: unknown) => void;
  warn: (message: string, obj?: unknown) => void;
};

type LoggerFactory = (name: string) => Logger;

type LoggerFactoryType = 'default' | 'pino';

/**
 * Logger factory that creates loggers of different types.
 * The default logger is a simple console logger.
 * The Pino logger is a more advanced logger that supports structured logging.
 */
let appLoggerFactory: LoggerFactory;

/**
 * Default logger implementation that logs messages to the console.
 * It provides methods for different log levels.
 * @param name - The name of the logger.
 * @returns {Logger} The default logger instance.
 */
function defaultLogger(name: string): Logger {
  return {
    info: (message: string) => console.log(`INFO [${name}]: ${message}`),
    error: (message: string) => console.error(`ERROR [${name}]: ${message}`),
    debug: (message: string) => console.debug(`DEBUG [${name}]: ${message}`),
    fatal: (message: string) => console.debug(`FATAL [${name}]: ${message}`),
    trace: (message: string) => console.debug(`TRACE [${name}]: ${message}`),
    warn: (message: string) => console.debug(`WARN [${name}]: ${message}`),
  };
}

/**
 * Pino logger implementation that logs messages using the Pino library.
 * It provides methods for different log levels and supports structured logging.
 */
export const pinoLogger: LoggerFactory = (
  name: string,
  { loglevel = 'debug' }: { loglevel?: string } = {}
): Logger => {
  const logger = pino({
    name,
    level: process.env.PINO_LOG_LEVEL || loglevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
    redact: {
      paths: ['email'],
    },
  });

  return {
    info: (message: string, obj?: unknown) => logger.info(obj, message),
    error: (message: string, error?: Error) => logger.error(error, message),
    debug: (message: string, obj?: unknown) => logger.debug(obj, message),
    fatal: (message: string, obj?: unknown) => logger.fatal(obj, message),
    trace: (message: string, obj?: unknown) => logger.trace(obj, message),
    warn: (message: string, obj?: unknown) => logger.warn(obj, message),
  };
};

/**
 * Initializes the logger module.
 * It sets up the logger factory based on the environment variable or the provided type.
 * @param type - The type of logger to use ('default' or 'pino').
 */
export default function initLogger(
  type: LoggerFactoryType = 'default',
  factory?: LoggerFactory
) {
  const loggerFactory = process.env.DEFAULT_LOGGER_FACTORY || type;

  if (factory) {
    appLoggerFactory = factory;
    return;
  }

  switch (loggerFactory) {
    case 'pino':
      appLoggerFactory = pinoLogger;
      break;
    default:
      appLoggerFactory = defaultLogger;
      break;
  }
}

/**
 *
 * @param name - The name of the logger.
 * @returns
 */
export function useLogger(name: string): Logger {
  if (!appLoggerFactory) {
    throw new DependencyInitializationError(
      'Logger module is not initialized. Please call initLogger first.'
    );
  }

  return appLoggerFactory(name);
}
