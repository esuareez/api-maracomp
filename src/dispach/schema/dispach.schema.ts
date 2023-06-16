import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

export class Dispach {
    @Prop()
    code: Number
    @Prop()
    date: Date
    @Prop()
    componentId: string
    @Prop()
    quantity: number
    @Prop()
    storeId: string
}

export const DispachSchema = SchemaFactory.createForClass(Dispach);