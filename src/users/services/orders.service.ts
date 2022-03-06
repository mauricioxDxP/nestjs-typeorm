import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto, UpdateOrderDto } from 'src/users/dtos/orders.dtos';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  findAll() {
    return this.orderRepository.find( { relations: ['customer'] });
  }

  async findOne(id: number): Promise<Order> {
    return await this.orderRepository.findOne(id, {
      relations: ['items.product', 'items'],
    });
  }

  async create(data: CreateOrderDto): Promise<Order> {
    const order = new Order();
    if(data.customerId) {
      const customer = await this.customerRepository.findOne(data.customerId);
      order.customer = customer;
    }
    return await this.orderRepository.save(order);
  }

  async update(id: number, changes: UpdateOrderDto): Promise<Order> {
    const orderToUpdate = await this.orderRepository.findOne(id);
    if(changes.customerId) {
      const customer = await this.customerRepository.findOne(
        changes.customerId,
      );
      orderToUpdate.customer = customer;
    }
    return await this.orderRepository.save(orderToUpdate);
  }

  async delete(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }

}
