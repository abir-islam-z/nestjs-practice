import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto, UpdateCoffeeDto } from './dto';

@Controller('coffee')
export class CoffeesController {
  constructor(private coffeeService: CoffeesService) {}

  @Get('/')
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeeService.findAll(paginationQuery);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCoffeeDto) {
    return this.coffeeService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffeeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCoffeeDto) {
    return this.coffeeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(typeof id);
    return this.coffeeService.remove(id);
  }
}
