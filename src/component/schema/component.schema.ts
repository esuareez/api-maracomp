import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Store } from 'src/store/schema/store.schema';
import * as mongoose from 'mongoose';

@Schema()
export class Component {

    @Prop({unique: true})
    code: string

    @Prop()
    description: string

    @Prop()
    unit: string

    @Prop()
    store: [{
        store: string,
        balance: number}]
}

export const ComponentSchema = SchemaFactory.createForClass(Component);