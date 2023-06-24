import { Controller } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService : OrderService) {}

    @Delete()
    async deleteAll(){
        return this.orderService.deleteAll();
    }
}
