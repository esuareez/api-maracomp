import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum OrderStatus {
  CREATING = 'CREANDO',
  PENDING = 'PENDIENTE',
  COMPLETED = 'COMPLETADA',
}

@Schema()
export class Order {
  @Prop({ unique: true })
  code?: Number;
  @Prop()
  supplierId?: string;
  @Prop()
  date?: Date;
  @Prop()
  total?: number;
  @Prop({ default: OrderStatus.CREATING })
  status?: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
