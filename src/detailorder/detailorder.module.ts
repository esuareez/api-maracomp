import { Module, forwardRef } from '@nestjs/common';
import { OrderRequestModule } from 'src/order-request/order-request.module';
import { StoreModule } from 'src/store/store.module';
import { ComponentModule } from 'src/component/component.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { SupplierTimeModule } from 'src/supplier-time/supplier-time.module';
import { InventoryMovementModule } from 'src/inventorymovement/inventorymovement.module';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from 'src/order/schema/order.schema';
import { OrderRequestSchema } from 'src/order-request/schema/order-request.schema';
import { DetailorderController } from './detailorder.controller';
import { DetailorderService } from './detailorder.service';
import { DetailOrderSchema } from './schema/detailorder.schema';
import { StoreSchema } from 'src/store/schema/store.schema';
import { ComponentSchema } from 'src/component/schema/component.schema';
import { SupplierSchema } from 'src/supplier/schema/supplier.schema';
import { SupplierTimeSchema } from 'src/supplier-time/schema/supplierTime.schema';
import { InventoryMovementSchema } from 'src/inventorymovement/schema/inventorymovement.schema';
import { OrderModule } from 'src/order/order.module';


@Module({
    imports: [
        forwardRef(() => OrderRequestModule),
        StoreModule,
        ComponentModule,
        SupplierModule,
        SupplierTimeModule,
        InventoryMovementModule,
        OrderModule,
        MongooseModule.forFeature([{name:'DetailOrder', schema: DetailOrderSchema}, 
        {name: 'Order', schema: OrderSchema},
        {name: 'OrderRequest', schema: OrderRequestSchema},
        ])
      ],
      controllers: [DetailorderController],
      providers: [DetailorderService,
        {provide: 'StoreModel', useValue: StoreSchema},
        { provide: 'ComponentModel', useValue: ComponentSchema},
        { provide: 'SupplierModel', useValue: SupplierSchema},
        { provide: 'SupplierTimeModel', useValue: SupplierTimeSchema},
        { provide: 'InventoryMovementModel', useValue: InventoryMovementSchema},
        { provide: 'OrderModel', useValue: OrderSchema}],
        exports: [DetailorderService]
})
export class DetailorderModule {

}
