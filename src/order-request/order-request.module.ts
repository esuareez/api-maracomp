import { Module } from '@nestjs/common';
import { OrderRequestController } from './order-request.controller';
import { OrderRequestService } from './order-request.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderRequestSchema } from './schema/order-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'OrderRequest', schema: OrderRequestSchema }])
  ],
  controllers: [OrderRequestController],
  providers: [OrderRequestService]
})
export class OrderRequestModule {}
