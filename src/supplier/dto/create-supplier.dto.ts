import { IsNotEmpty, IsNumber, IsString, Max, MaxLength } from 'class-validator';

export class createSupplierDto{
    @IsNumber()
    @IsNotEmpty()
    code: Number;
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(9)
    rnc: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    ciudad: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    direccion: string;
}