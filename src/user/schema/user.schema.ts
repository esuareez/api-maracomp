import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User{
    @Prop()
    name: string;
    
    @Prop({unique: true, required: true})
    username: string;

    @Prop({required: true})
    password: string;

}

// Define el esquema en la base de datos.
export const UserSchema = SchemaFactory.createForClass(User); 