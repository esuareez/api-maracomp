import { Module } from '@nestjs/common';
import { DispachController } from './dispach.controller';
import { DispachService } from './dispach.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { DispachSchema } from './schema/dispach.schema';
import { InventoryMovementModule } from 'src/inventorymovement/inventorymovement.module';
import { InventoryMovementSchema } from 'src/inventorymovement/schema/inventorymovement.schema';
import { ComponentModule } from 'src/component/component.module';
import { ComponentSchema } from 'src/component/schema/component.schema';
import { StoreModule } from 'src/store/store.module';
import { StoreSchema } from 'src/store/schema/store.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Dispach', schema: DispachSchema }, 
    {name: 'InventoryMovement', schema: InventoryMovementSchema},
    ]),
    InventoryMovementModule,
    ComponentModule, 
    StoreModule
  ],
  controllers: [DispachController],
  providers: [DispachService,
  {provide: 'InventoryMovementService', useValue: InventoryMovementSchema},
  {provide: 'ComponentService', useValue: ComponentSchema},
  {provide: 'StoreService', useValue: StoreSchema},]
})
export class DispachModule {}
