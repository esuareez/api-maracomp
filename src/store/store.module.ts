import { Module, forwardRef } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from './schema/store.schema';
import { ComponentModule } from 'src/component/component.module';
import { ComponentSchema } from 'src/component/schema/component.schema';
import { SupplierTimeModule } from 'src/supplier-time/supplier-time.module';
import { SupplierTimeSchema } from 'src/supplier-time/schema/supplierTime.schema';
import { ComponentService } from 'src/component/component.service';
import { InventoryMovementModule } from 'src/inventorymovement/inventorymovement.module';


@Module({
  imports: [
    ComponentModule,
    SupplierTimeModule,
    MongooseModule.forFeature([
        { name: 'Store', schema: StoreSchema },
    ])
  ],
  controllers: [StoreController],
  providers: [StoreService,
    { provide: 'ComponentModel', useValue: ComponentSchema },
    { provide: 'SupplierTimeModel', useValue: SupplierTimeSchema }],
    exports: [StoreService]
})
export class StoreModule {}
