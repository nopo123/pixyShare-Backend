import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validationPipelinesHelper } from './common/helpers/app-create.helper';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  validationPipelinesHelper(app);

  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
