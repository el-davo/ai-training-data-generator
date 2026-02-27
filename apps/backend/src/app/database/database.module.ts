import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { AppKvEntity } from './app.entity';

function toBool(value: unknown, defaultValue: boolean): boolean {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  return String(value).toLowerCase() === 'true' || String(value) === '1';
}

function toInt(value: unknown, defaultValue: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : defaultValue;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): DataSourceOptions => {
        const nodeEnv = config.get<string>('NODE_ENV') ?? 'development';
        const configuredType = config.get<string>('DB_TYPE');

        // Defaults:
        // - Local/dev: in-memory SQLite (zero-config)
        // - Prod: Postgres
        const type =
          configuredType ??
          (nodeEnv === 'production' ? 'postgres' : 'sqlite');

        const synchronize = toBool(
          config.get('DB_SYNCHRONIZE'),
          type === 'sqlite' && nodeEnv !== 'production',
        );

        const logging = toBool(config.get('DB_LOGGING'), false);

        if (type === 'sqlite') {
          const database = config.get<string>('DB_DATABASE') ?? ':memory:';
          return {
            type: 'sqlite',
            database,
            entities: [AppKvEntity],
            synchronize,
            logging,
          };
        }

        const host = config.get<string>('DB_HOST') ?? '127.0.0.1';
        const port = toInt(
          config.get('DB_PORT'),
          type === 'mysql' ? 3306 : 5432,
        );
        const username = config.get<string>('DB_USER') ?? 'app';
        const password = config.get<string>('DB_PASSWORD') ?? 'app';
        const database = config.get<string>('DB_NAME') ?? 'app';

        const sslEnabled = toBool(config.get('DB_SSL'), false);
        const rejectUnauthorized = toBool(
          config.get('DB_SSL_REJECT_UNAUTHORIZED'),
          true,
        );

        if (type === 'mysql') {
          return {
            type: 'mysql',
            host,
            port,
            username,
            password,
            database,
            entities: [AppKvEntity],
            synchronize,
            logging,
          };
        }

        // Postgres (default)
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [AppKvEntity],
          synchronize,
          logging,
          ssl: sslEnabled ? { rejectUnauthorized } : false,
        };
      },
    }),
    TypeOrmModule.forFeature([AppKvEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

