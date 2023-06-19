import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateSupplierTimeDTO{
    @IsOptional()
    @IsNumber()
    supplierCode?: Number
    @IsOptional()
    @IsString()
    componentId?: string
    @IsNotEmpty()
    @IsNumber()
    deliveryTimeInDays: Number
    @IsNotEmpty()
    @IsNumber()
    price: Number
    @IsNotEmpty()
    @IsNumber()
    discount: Number
    @IsBoolean()
    @IsNotEmpty()
    state: boolean
}