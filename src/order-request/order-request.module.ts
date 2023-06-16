import { Module } from '@nestjs/common';
import { OrderRequestController } from './order-request.controller';
import { OrderRequestService } from './order-request.service';

@Module({
  controllers: [OrderRequestController],
  providers: [OrderRequestService]
})
export class OrderRequestModule {}
