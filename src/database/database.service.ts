import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Pool, PoolClient, QueryResultRow } from 'pg';
import { WinstonLoggerService } from '../logger/logger.service';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  constructor(
    @Inject('PG_POOL') private readonly pool: Pool,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(DatabaseService.name);
  }

  /**
   * For standard, single-query operations (SELECT, single INSERT/UPDATE).
   * Automatically checks out and returns a client from the pool.
   */
  async query<T extends QueryResultRow = any>(
    queryText: string,
    values?: any[],
  ): Promise<T[]> {
    try {
      const result = await this.pool.query<T>(queryText, values);
      return result.rows;
    } catch (error: unknown) {
      this.logger.error(
        `Query failed: ${queryText}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * For multi-step operations that must succeed or fail together.
   * Guarantees the client is released back to the pool even if an error is thrown.
   */
  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error: unknown) {
      await client.query('ROLLBACK');
      this.logger.error(
        'Transaction rolled back due to error',
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    } finally {
      client.release();
    }
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(
      `Closing PostgreSQL pool due to application shutdown (${signal})...`,
    );
    await this.pool.end();
  }
}
