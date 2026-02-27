import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { HelloResolver } from './graphql/hello.resolver';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets', 'dashboard', 'browser'),
      // Use path-to-regexp v6-compatible patterns.
      // This prevents ServeStatic from intercepting API/GraphQL routes.
      exclude: ['/api/{*any}', '/graphql', '/graphql/{*any}'],
    }),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // GraphQL endpoint is available at `/graphql`.
      path: 'graphql',
      autoSchemaFile: true,
      introspection: true,
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, HelloResolver],
})
export class AppModule {}
