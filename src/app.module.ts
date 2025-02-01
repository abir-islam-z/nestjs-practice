import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { CommonModule } from './common/common.module';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CoffeesModule,
    CommonModule,
    CoffeeRatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
