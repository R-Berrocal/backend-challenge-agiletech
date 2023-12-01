import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { JwtService } from '@nestjs/jwt';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import * as Joi from 'joi';
import { EnvConfiguration } from './config/env.config';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EquipmentsModule } from './equipments/equipments.module';
import { ReportsModule } from './reports/reports.module';
import { UsersService } from './users/users.service';

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
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule, UsersModule],
      inject: [JwtService, UsersService],
      useFactory: (jwtService: JwtService, usersService: UsersService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        subscriptions: {
          'subscriptions-transport-ws': {
            path: '/graphql',
            onConnect: async (connectionParams: any) => {
              const authToken = connectionParams?.Authorization;

              if (!authToken) {
                throw new Error('Authorization token not provided');
              }

              const token = authToken.replace('Bearer ', '');
              const payload = jwtService.decode(token);
              if (!payload) {
                throw new Error('Invalid authorization token');
              }

              const user = await usersService.findOne(payload['id']);
              return {
                user,
              };
            },
          },
        },
        formatError: (error: GraphQLError) => {
          const graphQLFormattedError: GraphQLFormattedError = {
            message:
              (error?.extensions?.originalError as string) || error?.message,
          };
          return graphQLFormattedError;
        },
      }),
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
