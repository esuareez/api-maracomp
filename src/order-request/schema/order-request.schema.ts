import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

export enum OrderRequestPriority {
    CHEAP = 'BARATO',
    FASTER = 'RAPIDO',
}

@Schema()
export class OrderRequest {
    @Prop()
    code: Number
    @Prop()
    date: Date
    @Prop()
    componentId: string
    @Prop()
    quantity: number
    @Prop({default: OrderRequestPriority.CHEAP})
    priority: OrderRequestPriority
    @Prop()
    storeId: string
    @Prop()
    unit: string
}

export const OrderRequestSchema = SchemaFactory.createForClass(OrderRequest);