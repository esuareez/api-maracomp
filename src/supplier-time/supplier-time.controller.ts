import { Controller, Post, Get, Put, Delete, Body, Param, ValidationPipe } from '@nestjs/common';
import { SupplierTimeService } from './supplier-time.service';
import { FormDataDTO } from './dto/form.dto';

@Controller('supplierTime')
export class SupplierTimeController {
    constructor(private readonly supplierTimeService: SupplierTimeService) {}

    @Post()
    async create(@Body(new ValidationPipe()) formData : FormDataDTO){
        console.log(formData.component)
        console.log(formData.supplierTime)
        return this.supplierTimeService.create(formData.component, formData.supplierTime);
    }

    @Get()
    async findAll(){
        return this.supplierTimeService.findAll();
    }

}

