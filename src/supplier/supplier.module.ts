import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierSchema } from './schema/supplier.schema';

@Module({
  // Se debe importar el modelo de datos para que pueda ser usado por el servicio.
  imports: [
    MongooseModule.forFeature([{
      name: Supplier.name,
      schema: SupplierSchema,
    }])
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService]
})
export class SupplierModule {}
