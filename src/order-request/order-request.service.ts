import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderRequest } from './schema/order-request.schema';
import { Model } from 'mongoose';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { UpdateOrderRequestDto } from './dto/uptade-order-request.dto';
import { DetailorderService } from 'src/detailorder/detailorder.service';

@Injectable()
export class OrderRequestService {
    constructor(@InjectModel(OrderRequest.name) private readonly orderRequestModel : Model<OrderRequest>,
    private readonly detailOrderService: DetailorderService
    ){}

    async create(orderRequest: OrderRequest){
        const createdOrderRequest = new this.orderRequestModel(orderRequest);
        createdOrderRequest.code = await this.generateCode()
        createdOrderRequest.save()
        return await this.detailOrderService.create(createdOrderRequest,createdOrderRequest._id.toString())
    }

    async findAll(){
        return this.orderRequestModel.find().exec();
    }

    async findOne(id: string){
        return this.orderRequestModel.findById(id).exec();
    }

    async update(id: string, orderRequest: any){
        return this.orderRequestModel.findByIdAndUpdate(id, orderRequest).exec();
    }

    async delete(id: string){
        return this.orderRequestModel.findByIdAndDelete(id).exec();
    }

    async generateCode(){
        const lastOrder = (await this.findAll()).length
        return lastOrder + 1
    }
}
