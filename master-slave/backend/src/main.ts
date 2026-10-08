import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors();
  } else {
    app.enableCors({ origin: process.env.FRONTEND_URL || 'http://localhost' });
  }
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
