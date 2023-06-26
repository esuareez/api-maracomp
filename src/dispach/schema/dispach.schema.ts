import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Dispach {
  @Prop()
  code?: Number;
  @Prop()
  date?: Date;
  @Prop()
  detail: [
    {
      componentId: string;
      quantity: number;
      storeId: string;
    },
  ];
}

export const DispachSchema = SchemaFactory.createForClass(Dispach);
