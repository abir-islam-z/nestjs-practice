import { Injectable, Module, Scope } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { COFFEE_BRANDS } from './coffees.constant';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee, CoffeeSchema } from './entities/coffee.entity';
import { Event, EventSchema } from './entities/event.entity';
import { Flavor, FlavorSchema } from './entities/flavor.entity';

export class MockCoffeeService {}
export class DevelopmentCoffeeService {}
export class ProductionCoffeeService {}

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    return ['buddy brew', 'nescafe', 'folgers'];
  }
}

@Module({
  imports: [
    // TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    MongooseModule.forFeature([
      { name: Coffee.name, schema: CoffeeSchema },
      {
        name: Event.name,
        schema: EventSchema,
      },

      { name: Flavor.name, schema: FlavorSchema },
    ]),
  ],
  providers: [
    CoffeesService,
    CoffeeBrandsFactory,
    {
      provide: COFFEE_BRANDS,
      useFactory: (brands: CoffeeBrandsFactory) => brands.create(),
      inject: [CoffeeBrandsFactory],
      scope: Scope.TRANSIENT,
    },
  ],
  /* providers: [
    CoffeesService,
    ,
    {
      provide: CoffeesService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentCoffeeService
          : ProductionCoffeeService,
    },
    { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] },
    { provide: COFFEE_BRANDS, useFactory: () => ['buddy brew', 'nescafe'] },
  ] */
  // providers: [{ provide: CoffeesService, useValue: new MockCoffeeService() }],
  controllers: [CoffeesController],
  exports: [CoffeesService],
})
export class CoffeesModule {}
