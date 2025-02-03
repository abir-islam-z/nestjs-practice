import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  // swagger
  // npm i @nestjs/swagger swagger-ui-express

  const config = new DocumentBuilder()
    .setTitle('I Luv coffee')
    .setDescription('The I Luv coffee API description')
    .setVersion('1.0')
    .addTag('coffee')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
