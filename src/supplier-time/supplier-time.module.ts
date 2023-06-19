import { Module, forwardRef } from '@nestjs/common';
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
    MongooseModule.forFeature([
    { name: SupplierTime.name, schema: SupplierTimeSchema }])
  ],
  controllers: [SupplierTimeController],
  providers: [SupplierTimeService],
  exports: [SupplierTimeService]
})
export class SupplierTimeModule {}
