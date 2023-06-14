import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Component } from './schema/component.schema';
import { Model } from 'mongoose';

@Injectable()
export class ComponentService {
    constructor(@InjectModel(Component.name) private componentModel: Model<Component>) {}

    async create(component: any){
        const newComponent = new this.componentModel(component);
        return await newComponent.save();
    }
}
