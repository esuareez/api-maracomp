import { Controller, Post, Get, Put, Delete, Body, Param, ValidationPipe } from '@nestjs/common';
import { SupplierTimeService } from './supplier-time.service';
import { FormDataDTO } from './dto/form.dto';

@Controller('supplierTime')
export class SupplierTimeController {
    constructor(private readonly supplierTimeService: SupplierTimeService) {}

    @Get()
    async findAll(){
        return this.supplierTimeService.findAll();
    }

    @Delete()
    async deleteAll(){
        return this.supplierTimeService.deleteAll();
    }

}

