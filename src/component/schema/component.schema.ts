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

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Store'}]})
    store: Store[]
}

export const ComponentSchema = SchemaFactory.createForClass(Component);