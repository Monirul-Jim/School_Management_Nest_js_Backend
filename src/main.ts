import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'; // <- fixed import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // now works correctly

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
