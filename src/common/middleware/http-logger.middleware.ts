import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, originalUrl, body, query, params, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;

      this.logger.info(`HTTP ${method} ${originalUrl}`, {
        context: 'HttpLogger',
        metadata: {
          method,
          url: originalUrl,
          statusCode,
          duration: `${duration}ms`,
          ip,
          userAgent,
          params,
          query,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          body: this.sanitizeBody(body),
        },
      });
    });

    next();
  }

  private sanitizeBody(body: any) {
    if (!body) return {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const sanitized = { ...body };
    const blacklistedFields = [
      'password',
      'token',
      'accessToken',
      'clientSecret',
    ];

    blacklistedFields.forEach((field) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (sanitized[field]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        sanitized[field] = '********';
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return sanitized;
  }
}
