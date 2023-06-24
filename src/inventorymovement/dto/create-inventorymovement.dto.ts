import { IsEmpty, IsString, IsDate, IsNumber, IsNotEmpty, IsEnum } from "class-validator";
import { InventoryMovementType } from "../schema/inventorymovement.schema";

export class CreateInventoryMovementDto {
    @IsNumber()
    @IsNotEmpty()
    code: Number
    @IsDate()
    @IsNotEmpty()
    date: Date
    @IsString()
    @IsNotEmpty()
    idStore: string
    @IsEnum(InventoryMovementType)
    @IsNotEmpty()
    type: InventoryMovementType
    @IsNotEmpty()
    detail: [{
        idComponent: string,
        quantity: Number
        unit: string
    }]
}