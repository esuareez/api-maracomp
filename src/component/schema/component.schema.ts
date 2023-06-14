import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

@Schema()
export class Component {

    @Prop({required: true})
    code: string

    @Prop({required: true})
    description: string

    @Prop({required: true})
    unit: string

    @Prop({required: true})
    almacenes: [{
        code: Number
        balance: Number
        description: String
    }]
}

export const ComponentSchema = SchemaFactory.createForClass(Component);