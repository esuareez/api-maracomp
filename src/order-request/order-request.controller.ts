import { Controller } from '@nestjs/common';
import { OrderRequestService } from './order-request.service';
import { Post, Get, Put, Delete, ValidationPipe, Body, Param } from '@nestjs/common';
import { OrderRequest } from './schema/order-request.schema';

@Controller('orderRequest')
export class OrderRequestController {
    constructor(private readonly orderRequestService : OrderRequestService){}

    @Post()
    async create(@Body(new ValidationPipe()) orderRequest : OrderRequest){
        return this.orderRequestService.create(orderRequest);
    }

    @Get()
    async findAll(){
        return this.orderRequestService.findAll();
    }

    @Put(':id')
    async update(@Param('id') id, @Body(new ValidationPipe()) orderRequest){
        return this.orderRequestService.update(id, orderRequest);
    }

    @Delete(':id')
    async delete(@Param('id') id){
        return this.orderRequestService.delete(id);
    }
}
