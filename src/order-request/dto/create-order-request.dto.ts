import { IsEmpty, IsString, IsNumber, IsOptional, IsDate, IsNotEmpty, IsEnum } from "class-validator";
import { OrderRequestPriority } from "../schema/order-request.schema";

export class CreateOrderRequestDto {
    @IsOptional()
    @IsNumber()
    code?: Number
    @IsDate()
    @IsNotEmpty()
    date: Date
    @IsString()
    @IsNotEmpty()
    componentId: string
    @IsNumber()
    @IsNotEmpty()
    quantity: number
    @IsEnum(OrderRequestPriority)
    priority: OrderRequestPriority
    @IsNotEmpty()
    @IsString()
    storeId: string
    @IsNotEmpty()
    @IsString()
    unit: string
}