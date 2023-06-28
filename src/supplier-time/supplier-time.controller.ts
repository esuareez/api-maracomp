import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { SupplierTimeService } from './supplier-time.service';
import { FormDataDTO } from './dto/form.dto';
import { SupplierTime } from './schema/supplierTime.schema';
import { Supplier } from 'src/supplier/schema/supplier.schema';

@Controller('supplierTime')
export class SupplierTimeController {
  constructor(private readonly supplierTimeService: SupplierTimeService) {}

  @Get()
  async findAll() {
    return this.supplierTimeService.findAll();
  }

  @Delete()
  async deleteAll() {
    return this.supplierTimeService.deleteAll();
  }

  @Post()
  async create(@Body(new ValidationPipe()) supplierTime: SupplierTime) {
    return this.supplierTimeService.create(supplierTime);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) supplierTime: SupplierTime,
  ) {
    return this.supplierTimeService.update(id, supplierTime);
  }
}
