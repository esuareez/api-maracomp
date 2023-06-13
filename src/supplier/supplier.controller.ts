import { Controller, Get, Put, Param, ValidationPipe, Body, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier } from './schema/supplier.schema';
import { Model } from 'mongoose';
import { SupplierService } from './supplier.service';
import { createSupplierDto } from './dto/create-supplier.dto';
import { updateSupplierDto } from './dto/update-supplier.dto';



@Controller('supplier')
export class SupplierController {
    constructor(private supplierService: SupplierService){}

    @Post()
    async create(@Body(new ValidationPipe()) createSupplier : createSupplierDto){
        return this.supplierService.create(createSupplier);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body(new ValidationPipe()) updateUser : updateSupplierDto){
        return this.supplierService.update(id, updateUser);
    }

    @Get()
    async findAll(){
        return this.supplierService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string){
        return this.supplierService.findOne(id);
    }
}
