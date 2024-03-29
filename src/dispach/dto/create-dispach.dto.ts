import { IsString, IsNumber, IsNotEmpty, IsOptional, IsDate } from "class-validator";

export class CreateDispachDto {
    @IsOptional()
    @IsNumber()
    code?: Number
    @IsDate()
    @IsOptional()
    date?: Date
    @IsString()
    @IsNotEmpty()
    componentId: string[]
    @IsNumber()
    @IsNotEmpty()
    quantity: number
    @IsString()
    @IsNotEmpty()
    storeId: string
}