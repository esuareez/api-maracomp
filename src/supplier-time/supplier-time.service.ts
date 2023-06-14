import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SupplierTime } from './schema/supplierTime.schema';
import { Model } from 'mongoose';

@Injectable()
export class SupplierTimeService {
    constructor(@InjectModel(SupplierTime.name) private supplierTimeModel: Model<SupplierTime>) {}

    // Crear el tiempo de entrega de los suplidores
    async create(supplierTime: any){
        const newSupplierTime = new this.supplierTimeModel(supplierTime);
        return await newSupplierTime.save();
    }
}
