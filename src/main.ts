import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './validation.pipe';
import { CorsOptions } from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Configure CORS options
  const corsOptions: CorsOptions = {
    origin: '*', // Set the appropriate origin or origins here
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  };

  // Enable CORS using the configured options
  app.enableCors(corsOptions);

  await app.listen(8000);
}
bootstrap();
