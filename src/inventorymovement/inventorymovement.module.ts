import { Module } from '@nestjs/common';
import { InventorymovementService } from './inventorymovement.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryMovementSchema } from './schema/inventorymovement.schema';
import { InventorymovementController } from './inventorymovement.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'InventoryMovement', schema: InventoryMovementSchema}])
  ],
  providers: [InventorymovementService],
  exports: [InventorymovementService],
  controllers: [InventorymovementController]
})
export class InventoryMovementModule {}
