import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum OrderStatus {
    PENDING = 'PENDIENTE',
    COMPLETED = 'COMPLETADA',
}

@Schema()
export class Order{
    @Prop({unique: true})
    code?: Number
    @Prop()
    supplierId?: string
    @Prop()
    orderRequestId?: string
    @Prop()
    date?: Date
    @Prop()
    total?: number
    @Prop()
    status?: OrderStatus.PENDING
}

export const OrderSchema = SchemaFactory.createForClass(Order);