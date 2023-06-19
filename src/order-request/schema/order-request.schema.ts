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
    @Prop({default: OrderRequestPriority.CHEAP})
    priority: OrderRequestPriority
    @Prop()
    detail:[{
        componentId: string
        quantity: number
        storeId: string
        unit: string
    }]
}

export const OrderRequestSchema = SchemaFactory.createForClass(OrderRequest);