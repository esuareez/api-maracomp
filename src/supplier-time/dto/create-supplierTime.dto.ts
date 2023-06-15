import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateSupplierTimeDTO{
    @IsNotEmpty()
    @IsNumber()
    supplierCode: Number
    @IsNotEmpty()
    @IsString()
    componentCode: string
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