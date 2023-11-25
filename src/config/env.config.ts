export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV ?? 'dev',
  databaseUrl: process.env.DATABASE_URL ?? '',
  port: +(process.env.PORT ?? 3000),
});
