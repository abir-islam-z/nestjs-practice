import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: config.get('DB_TYPE') as any,
        host: config.get('DB_HOST') as string,
        port: config.get('DB_PORT') as number,
        username: config.get('DB_USERNAME') as string,
        password: config.get('DB_PASSWORD') as string,
        database: config.get('DB_DATABASE') as string,
        autoLoadEntities: config.get('DB_AUTOLOAD_ENTITIES') === 'true',
        synchronize: config.get('DB_SYNCHRONIZE') === 'true',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class CommonModule {}
