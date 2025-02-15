import { Module } from '@nestjs/common';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { DatabaseModule } from 'src/database/database.module';
import { CoffeeRatingService } from './coffee-rating.service';

@Module({
  providers: [CoffeeRatingService],

  // That's encapsulation in action! The CoffeeRatingModule is importing the CoffeesModule, which means that the CoffeeRatingModule has access to all the providers and controllers exported by the CoffeesModule. This is how you can share providers and controllers between modules in Nest.
  imports: [
    CoffeesModule,
    DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      password: 'password',
      port: 5432,
    }),
  ],
})
export class CoffeeRatingModule {}
