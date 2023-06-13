import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength } from 'class-validator';

export class updateSupplierDto{
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    code?: Number;
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(9)
    @IsOptional()
    rnc?: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @IsOptional()
    ciudad?: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @IsOptional()
    direccion?: string;
}