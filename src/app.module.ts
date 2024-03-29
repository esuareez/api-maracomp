import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { SupplierModule } from './supplier/supplier.module';
import { SupplierTimeModule } from './supplier-time/supplier-time.module';
import { ComponentModule } from './component/component.module';
import { StoreService } from './store/store.service';
import { StoreModule } from './store/store.module';
import { InventoryMovementModule } from './inventorymovement/inventorymovement.module';
import { OrderRequestModule } from './order-request/order-request.module';
import { DispachModule } from './dispach/dispach.module';
import { OrderModule } from './order/order.module';
import { DetailorderController } from './detailorder/detailorder.controller';
import { DetailorderService } from './detailorder/detailorder.service';
import { DetailorderModule } from './detailorder/detailorder.module';

@Module({
  // Modulo de mongoose al modulo de nuestra app para poder usar mongo.
  // forRoot define config de la conexion a mongo.
  imports: [MongooseModule.forRoot('mongodb+srv://eliamps07:eliam123@cluster0.jupsou2.mongodb.net/maracompdb?retryWrites=true&w=majority'), 
    UserModule, SupplierModule, SupplierTimeModule, ComponentModule, StoreModule, InventoryMovementModule, OrderRequestModule, DispachModule, OrderModule, DetailorderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
