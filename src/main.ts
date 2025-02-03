import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validator is a pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  // nest g filter common/filters/http-exception --flat --no-spec
  app.useGlobalFilters(new HttpExceptionFilter());

  // nest g guard common/guards/auth --flat --no-spec
  // app.useGlobalGuards(new AuthGuard());

  // nest g interceptor common/interceptors/wrap-response --flat --no-spec

  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
