import { Module } from '@nestjs/common';

import { CustomerController } from './controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { Customer } from './entities/customer.entity';

import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { OrderItemController } from './controllers/order-item.controller';
import { OrderItemService } from './services/order-item.service';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([User, Customer, Order, OrderItem]),
  ],
  controllers: [CustomerController, UsersController, OrdersController, OrderItemController],
  providers: [CustomersService, UsersService, OrdersService, OrderItemService],
})
export class UsersModule {}
