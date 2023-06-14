import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum state{
    active = "ACTIVE",
    inactive = "INACTIVE"
}

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

    @Prop({default: state.inactive})
    state: state
}

export const SupplierTimeSchema = SchemaFactory.createForClass(SupplierTime);