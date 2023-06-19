import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schema/order.schema';
import { DetailorderModule } from 'src/detailorder/detailorder.module';
import { DetailOrderSchema } from 'src/detailorder/schema/detailorder.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema },
    {name: 'DetailOrder', schema: DetailOrderSchema}])
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
