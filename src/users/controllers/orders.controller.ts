import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/orders.dtos';
import { Order } from '../entities/order.entity';
import { OrdersService } from '../services/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
  ) {

  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
   get(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  create(@Body() order: CreateOrderDto) {
    return this.ordersService.create(order);
  }

  @Put()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, changes);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.delete(id);
  }

}
