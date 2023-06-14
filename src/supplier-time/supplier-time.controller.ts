import { Controller } from '@nestjs/common';
import { SupplierTimeService } from './supplier-time.service';

@Controller('supplier-time')
export class SupplierTimeController {
    constructor(private supplierTimeService: SupplierTimeService) {}

    async create(supplierTime: any){
        return await this.supplierTimeService.create(supplierTime);
    }
}
