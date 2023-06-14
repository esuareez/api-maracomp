import { Module } from '@nestjs/common';
import { SupplierTimeController } from './supplier-time.controller';
import { SupplierTimeService } from './supplier-time.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierTime, SupplierTimeSchema } from './schema/supplierTime.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: SupplierTime.name,
      schema: SupplierTimeSchema,
    }])
  ],
  controllers: [SupplierTimeController],
  providers: [SupplierTimeService]
})
export class SupplierTimeModule {}
