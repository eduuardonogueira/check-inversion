import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';

async function bootstrap() {
  const logger = new Logger();
  const port = configuration().port;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors();
  await app.listen(port);
  logger.log(`Server is running on port: ${port}`);
}
bootstrap();
