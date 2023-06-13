import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Supplier{

    @Prop()
    code: Number;

    @Prop()
    name: string;

    @Prop()
    rnc: string;

    @Prop()
    ciudad: string;

    @Prop()
    direccion: string;

}
// Define el esquema en la base de datos.
export const SupplierSchema = SchemaFactory.createForClass(Supplier);