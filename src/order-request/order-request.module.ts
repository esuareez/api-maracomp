import { Module } from '@nestjs/common';
import { OrderRequestController } from './order-request.controller';
import { OrderRequestService } from './order-request.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderRequestSchema } from './schema/order-request.schema';
import { DetailorderModule } from 'src/detailorder/detailorder.module';
import { DetailOrderSchema } from 'src/detailorder/schema/detailorder.schema';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() => DetailorderModule),
    MongooseModule.forFeature([{ name: 'OrderRequest', schema: OrderRequestSchema },
    {name: 'DetailOrder', schema: DetailOrderSchema}])
  ],
  controllers: [OrderRequestController],
  providers: [OrderRequestService,
    {provide: 'DetailOrderModel', useValue: DetailOrderSchema}],
  exports: [OrderRequestService]
})
export class OrderRequestModule {}
