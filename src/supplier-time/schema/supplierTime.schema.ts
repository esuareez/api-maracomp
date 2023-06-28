import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SupplierTime {
  @Prop()
  supplierId?: string;

  @Prop()
  componentId?: string;

  @Prop()
  deliveryTimeInDays?: Number;

  @Prop()
  price?: Number;

  @Prop({ default: 0 })
  discount?: Number;

  @Prop({ default: true })
  state?: boolean;
}

export const SupplierTimeSchema = SchemaFactory.createForClass(SupplierTime);
