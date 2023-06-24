import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier } from './schema/supplier.schema';
import { updateSupplierDto } from './dto/update-supplier.dto';
import { createSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SupplierService {
    constructor(@InjectModel(Supplier.name) private supplierModel: Model<Supplier>){}

    async create(supplier : createSupplierDto){
        const createdSupplier = new this.supplierModel(supplier);
        createdSupplier.code = await this.generateCode();
        return createdSupplier.save();
    }

    async update(id: string, supplier : updateSupplierDto){
        return this.supplierModel.findByIdAndUpdate(id, supplier, {new: true}).exec();
    }

    async findAll(){
        return this.supplierModel.find().exec();
    }

    async findOne(id: string){
        return this.supplierModel.findById(id).exec();
    }

    async generateCode(){
        const lastCode = await this.findAll();
        return lastCode.length + 1;
    }

}
