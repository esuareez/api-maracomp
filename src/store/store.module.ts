import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from './schema/store.schema';
import { ComponentModule } from 'src/component/component.module';
import { ComponentSchema } from 'src/component/schema/component.schema';


@Module({
  imports: [
    ComponentModule,
    MongooseModule.forFeature([
        { name: 'Store', schema: StoreSchema },
    { name: 'Component', schema: ComponentSchema },])
  ],
  controllers: [StoreController],
  providers: [StoreService,
    { provide: 'ComponentModel', useValue: ComponentSchema }],
    exports: [StoreService]
})
export class StoreModule {}
