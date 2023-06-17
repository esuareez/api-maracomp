import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SupplierTime } from './schema/supplierTime.schema';
import { Model } from 'mongoose';
import { ComponentService } from 'src/component/component.service';
import { StoreService } from 'src/store/store.service';
import { CreateComponentDto } from 'src/component/dto/create-component.dto';
import { CreateSupplierTimeDTO } from './dto/create-supplierTime.dto';

@Injectable()
export class SupplierTimeService {
    constructor(@InjectModel(SupplierTime.name) private supplierTimeModel: Model<SupplierTime>,
    private readonly storeService : StoreService) {}

    // Crear el tiempo de entrega de los suplidores
    async create(component: CreateComponentDto, supplierTime: CreateSupplierTimeDTO, supplier: any){
        await this.storeService.create(component);
        supplierTime.componentCode = component.code;
        supplierTime.supplierCode = supplier.code;
        const newSupplierTime = new this.supplierTimeModel(supplierTime);
        return await newSupplierTime.save();
    }

    async findAll(){
        return await this.supplierTimeModel.find().exec();
    }
}
