import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class createStoreDTO{

    @IsOptional()
    @IsNumber()
    code?: Number
    @IsNotEmpty()
    @IsString()
    description: string
    @IsOptional()
    @IsNumber()
    balance?: number

}