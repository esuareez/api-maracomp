import { Controller } from '@nestjs/common';
import { Delete, Get } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Delete()
  async deleteAll() {
    return this.orderService.deleteAll();
  }

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get('count')
  async count() {
    return this.orderService.count();
  }
}
