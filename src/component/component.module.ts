import { Module } from '@nestjs/common';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Component, ComponentSchema } from './schema/component.schema';
import { StoreService } from 'src/store/store.service';



@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Component.name,
      schema: ComponentSchema,
    }]), 
  ], 
  controllers: [ComponentController],
  providers: [ComponentService]
})
export class ComponentModule {}