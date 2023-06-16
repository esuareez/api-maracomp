import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


export enum InventoryMovementType{
    IN = 'ENTRADA',
    OUT = 'SALIDA'
}

@Schema()
export class InventoryMovement{
    @Prop({unique: true, required: true})
    code: Number
    @Prop()
    date: Date
    @Prop()
    idStore: string
    @Prop({default: InventoryMovementType.IN})
    type: InventoryMovementType
    @Prop()
    detail: [{
        idComponent: string,
        quantity: number
        unit: string
    }]
}

export const InventoryMovementSchema = SchemaFactory.createForClass(InventoryMovement);