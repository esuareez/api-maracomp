import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';

@Schema()
export class Store {

    @Prop({unique: true})
    code: Number

    @Prop()
    description: string

}


export const StoreSchema = SchemaFactory.createForClass(Store);