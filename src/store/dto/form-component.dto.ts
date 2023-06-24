import { IsEmpty, IsString, IsNumber, IsOptional } from "class-validator";

export class FormComponentDTO{
    @IsString()
    description: string;
    @IsString()
    unit: string;
    @IsNumber()
    balance: number;
    @IsString()
    storeDesc: string;
}