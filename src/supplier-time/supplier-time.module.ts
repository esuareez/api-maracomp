import { Module } from '@nestjs/common';
import { SupplierTimeService } from './supplier-time.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierTime, SupplierTimeSchema } from './schema/supplierTime.schema';
import { StoreSchema } from 'src/store/schema/store.schema';
import { ComponentSchema } from 'src/component/schema/component.schema';
import { SupplierTimeController } from './supplier-time.controller';
import { ComponentModule } from 'src/component/component.module';
import { StoreModule } from 'src/store/store.module';

@Module({
  imports: [
    // Importamos los modulos que utilizaremos.
    ComponentModule,
    StoreModule,
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema },
    { name: 'Component', schema: ComponentSchema },
    { name: 'SupplierTime', schema: SupplierTimeSchema }])
  ],
  controllers: [SupplierTimeController],
  providers: [SupplierTimeService,
    { provide: 'ComponentModel', useValue: ComponentSchema },
    { provide: 'StoreModel', useValue: StoreSchema }],
    // Se exporta el servicio para poder usarlo en otros modulos.
  exports: [SupplierTimeService]
})
export class SupplierTimeModule {}
