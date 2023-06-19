import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SupplierTime } from './schema/supplierTime.schema';
import { Model } from 'mongoose';
import { ComponentService } from 'src/component/component.service';
import { StoreService } from 'src/store/store.service';
import { CreateComponentDto } from 'src/component/dto/create-component.dto';
import { CreateSupplierTimeDTO } from './dto/create-supplierTime.dto';
import { Component } from 'src/component/schema/component.schema';
import { Supplier } from 'src/supplier/schema/supplier.schema';

@Injectable()
export class SupplierTimeService {
    constructor(@InjectModel(SupplierTime.name) private supplierTimeModel: Model<SupplierTime>,
    ) {}

    // Crear el tiempo de entrega de los suplidores
    async create(supplierTime: SupplierTime){
        const newSupplierTime = new this.supplierTimeModel(supplierTime);
        return await newSupplierTime.save();
    }

    async findAll(){
        return await this.supplierTimeModel.find().exec();
    }

    async deleteAll(){
        return await this.supplierTimeModel.deleteMany().exec();
    }

    async findAllComponents(componentId: string){
        const supplierTimes = await this.findAll();
        const components = [];
        for(let supplierTime of supplierTimes){
            if(componentId === supplierTime.componentId){
                components.push(supplierTime);
            }
        }
        return components;
    }

}
