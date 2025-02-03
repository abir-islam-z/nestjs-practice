import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateCoffeeDto, UpdateCoffeeDto } from './dto';
import { Coffee } from './entities/coffee.entity';
import { Event } from './entities/event.entity';
import { Flavor } from './entities/flavor.entity';

// @Injectable({ scope: Scope.TRANSIENT })
// @Injectable({ scope: Scope.REQUEST })
// @Injectable({ scope: Scope.DEFAULT })
@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectModel(Flavor.name) private readonly flavorModel: Model<Flavor>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeModel
      .find()
      .populate('flavors')
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeModel
      .findOne({
        _id: id,
      })
      .populate('flavors');
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const existingCoffee = await this.coffeeModel
      .findOneAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
      .exec();
    if (!existingCoffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return existingCoffee;
  }

  async remove(id: string) {
    const deleteCoffee = await this.coffeeModel.findByIdAndDelete(id);

    if (!deleteCoffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return deleteCoffee;
  }

  async recommendCoffee(coffee: Coffee) {
    const session = await this.connection.startSession();

    session.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId: coffee._id },
      });

      await recommendEvent.save({ session });
      await coffee.save({ session });

      await session.commitTransaction();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
