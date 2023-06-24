import { IsEmpty, IsString, IsNumber, IsOptional, IsDate, IsNotEmpty, IsEnum } from "class-validator";
import { OrderRequestPriority } from "../schema/order-request.schema";

export class UpdateOrderRequestDto {
    @IsOptional()
    @IsNumber()
    code?: Number
    @IsOptional()
    @IsDate()
    @IsNotEmpty()
    date?: Date
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    componentId?: string
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    quantity?: number
    @IsOptional()
    @IsEnum(OrderRequestPriority)
    priority?: OrderRequestPriority
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    storeId?: string
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    unit?: string
}