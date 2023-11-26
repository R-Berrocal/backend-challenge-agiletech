import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const PORT = 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      transform: true,
    }),
  );
  app.enableCors();

  await app.listen(PORT, async () =>
    console.log(`🚀 Server ready at: ${await app.getUrl()}/graphql`),
  );
}
bootstrap();
