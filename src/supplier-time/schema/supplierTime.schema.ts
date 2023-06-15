import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class SupplierTime {

    @Prop()
    supplierCode: Number

    @Prop()
    componentCode: string

    @Prop()
    deliveryTimeInDays: Number

    @Prop()
    price: Number

    @Prop({default: 0})
    discount: Number

    @Prop({default: false})
    state: boolean
}

export const SupplierTimeSchema = SchemaFactory.createForClass(SupplierTime);