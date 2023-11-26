import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import * as Joi from 'joi';
import { EnvConfiguration } from './config/env.config';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EquipmentsModule } from './equipments/equipments.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message:
            (error?.extensions?.originalError as string) || error?.message,
        };
        return graphQLFormattedError;
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: EnvConfiguration().databaseUrl,
      logging: EnvConfiguration().environment === 'dev',
      autoLoadEntities: true,
      synchronize: EnvConfiguration().environment === 'dev',
    }),
    UsersModule,
    AuthModule,
    EquipmentsModule,
    ReportsModule,
  ],
  providers: [AppResolver, AppService],
})
export class AppModule {}
