import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateOrderItemDto } from '../dtos/order-item.dtos';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem) private OrderItemRepository: Repository<OrderItem>,
  @InjectRepository(Order) private OrderRepository: Repository<Order>,
  @InjectRepository(Product) private ProductRepostory: Repository<Product>)
  {}

  async create(data: CreateOrderItemDto) {
    const order = await this.OrderRepository.findOne(data.orderId);
    const product = await this.ProductRepostory.findOne(data.productId);
    const item = new OrderItem();
    item.order = order;
    item.product = product;
    item.quantity = data.quantity;
    return this.OrderItemRepository.save(item);
  }

}
