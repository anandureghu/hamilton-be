import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HttpLogger');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, body, query, params, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const start = Date.now();

    const originalSend = res.send;
    let responseBody: any;

    res.send = (chunk: any): Response => {
      responseBody = chunk;
      return originalSend.call(res, chunk);
    };

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;

      let parsedResponseBody = responseBody;
      if (typeof responseBody === 'string') {
        try {
          parsedResponseBody = JSON.parse(responseBody);
        } catch {}
      }

      this.logger.log(
        `HTTP ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
        {
          context: 'HttpLogger',
          metadata: {
            method,
            url: originalUrl,
            statusCode,
            duration: `${duration}ms`,
            ip,
            userAgent,
            request: {
              params,
              query,
              body: this.sanitize(body),
            },
            response: {
              body: this.sanitize(parsedResponseBody),
            },
          },
        },
      );
    });

    next();
  }

  private sanitize(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const blacklistedFields = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'clientSecret',
      'secret',
      'authorization',
    ];

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitize(item));
    }

    const sanitized = { ...data };

    Object.keys(sanitized).forEach((key) => {
      if (blacklistedFields.includes(key.toLowerCase())) {
        sanitized[key] = '********';
      } else if (
        typeof sanitized[key] === 'object' &&
        sanitized[key] !== null
      ) {
        sanitized[key] = this.sanitize(sanitized[key]);
      }
    });

    return sanitized;
  }
}
