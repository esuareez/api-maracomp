import { IsOptional, IsNumber, IsString } from "class-validator";

export class UpdateStoreDto{
    @IsOptional()
    @IsNumber()
    code?: Number
    @IsOptional()
    @IsString()
    description?: string
    @IsOptional()
    @IsNumber()
    balance?: Number
}