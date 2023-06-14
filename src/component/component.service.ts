import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Component } from './schema/component.schema';
import { Error, Model } from 'mongoose';
import { CreateComponentDto } from './dto/create-component.dto';


@Injectable()
export class ComponentService {
    constructor(@InjectModel(Component.name) private componentModel: Model<Component>) {}

    

    async create(component: CreateComponentDto){
        
        const createdComponent = new this.componentModel(component);
        return await createdComponent.save();
        
        
    }

    async update(id: string, component: any){
        return await this.componentModel.findByIdAndUpdate(id, component, {new: true}).exec();
    }

    async findById(id: string){
        return await this.componentModel.findById(id).exec();
    }

    async findByCode(code: string){
        return await this.componentModel.findOne({code: code}).exec();
    }

    async findAll(){
        return await this.componentModel.find().exec();
    }
    
    


}
