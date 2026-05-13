import { Injectable, LoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService implements LoggerService {
  private context?: string;
  private readonly logger: winston.Logger;

  constructor() {
    const logFormat = winston.format.printf((info) => {
      const { timestamp, level, context, stack, message, ...meta } =
        info as any;

      const contextStr = typeof context === 'string' ? `[${context}] ` : '';

      const msgStr = stack
        ? stack
        : typeof message === 'string'
          ? message
          : JSON.stringify(message);

      const finalMeta =
        typeof context === 'object' ? { ...context, ...meta } : meta;

      const filteredMeta = { ...finalMeta };
      delete filteredMeta.timestamp;
      delete filteredMeta.level;

      const metaStr =
        Object.keys(filteredMeta).length > 0
          ? `\n${JSON.stringify(filteredMeta, null, 2)}`
          : '';

      return `${timestamp || ''} [${level}]: ${contextStr}${msgStr}${metaStr}`;
    });

    const transportsList: winston.transport[] = [];

    if (process.env.NODE_ENV !== 'production') {
      transportsList.push(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        } as winston.transports.FileTransportOptions),
      );
      transportsList.push(
        new winston.transports.File({
          filename: 'logs/combined.log',
        } as winston.transports.FileTransportOptions),
      );
    }

    transportsList.push(
      new winston.transports.Console({
        format: winston.format.combine(
          process.env.NODE_ENV !== 'production'
            ? winston.format.colorize()
            : winston.format.uncolorize(),
          logFormat,
        ),
      } as winston.transports.ConsoleTransportOptions),
    );

    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        logFormat,
      ),
      transports: transportsList,
    });
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: unknown, context?: string | object) {
    if (typeof context === 'object') {
      this.logger.info(message as string, context);
    } else {
      this.logger.info(message as string, { context: context || this.context });
    }
  }

  error(message: unknown, stack?: string, context?: string | object) {
    if (typeof context === 'object') {
      this.logger.error(message as string, { stack, ...context });
    } else {
      this.logger.error(message as string, {
        stack,
        context: context || this.context,
      });
    }
  }

  warn(message: unknown, context?: string | object) {
    if (typeof context === 'object') {
      this.logger.warn(message as string, context);
    } else {
      this.logger.warn(message as string, { context: context || this.context });
    }
  }

  debug(message: unknown, context?: string | object) {
    if (typeof context === 'object') {
      this.logger.debug(message as string, context);
    } else {
      this.logger.debug(message as string, {
        context: context || this.context,
      });
    }
  }

  verbose(message: unknown, context?: string | object) {
    if (typeof context === 'object') {
      this.logger.verbose(message as string, context);
    } else {
      this.logger.verbose(message as string, {
        context: context || this.context,
      });
    }
  }
}
