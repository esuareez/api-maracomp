import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class DetailOrder{
    @Prop({unique: true})
    code?: Number
    @Prop()
    orderCode?: Number
    @Prop()
    storeId?: string
    @Prop()
    componentId?: string
    @Prop()
    quantity?: number
    @Prop()
    price?: number
    @Prop()
    unit?: string
    @Prop({default: 0})
    discount?: number
    @Prop()
    total?: number
}

export const DetailOrderSchema = SchemaFactory.createForClass(DetailOrder);