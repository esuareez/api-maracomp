import { Module } from '@nestjs/common';
import { InventorymovementService } from './inventorymovement.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryMovementSchema } from './schema/inventorymovement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'InventoryMovement', schema: InventoryMovementSchema}])
  ],
  providers: [InventorymovementService],
  exports: [InventorymovementService]
})
export class InventoryMovementModule {}
