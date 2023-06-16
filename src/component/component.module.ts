import { Module, Global } from '@nestjs/common';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Component, ComponentSchema } from './schema/component.schema';
import { InventoryMovementModule } from 'src/inventorymovement/inventorymovement.module';
import { InventoryMovementSchema } from 'src/inventorymovement/schema/inventorymovement.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Component.name,
      schema: ComponentSchema,
    }, { name: 'InventoryMovement', schema: InventoryMovementSchema }]),
    InventoryMovementModule 
  ], 
  controllers: [ComponentController],
  providers: [ComponentService, { provide: 'InventoryMovementModel', useValue: InventoryMovementSchema }],
  exports: [ComponentService]
})
export class ComponentModule {}