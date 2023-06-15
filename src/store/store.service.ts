import { Body, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './schema/store.schema';
import { createStoreDTO } from './dto/create-store.dto';
import { ComponentService } from 'src/component/component.service';
import { Component } from 'src/component/schema/component.schema';
import { CreateComponentDto } from 'src/component/dto/create-component.dto';
import { isEmpty, isNotEmpty } from 'class-validator';


@Injectable()
export class StoreService {
    constructor(private readonly componentService : ComponentService,
        @InjectModel(Store.name) private readonly storeModel : Model<Store>){}

    async create(component: any){
        const createdStore = new this.storeModel(component.store);
        await createdStore.save();
        component.store = createdStore._id;
        return await this.componentService.create(component);
    }

    async agregate(id: string, store: createStoreDTO){
        const component = await this.componentService.findById(id);
        if(isNotEmpty(component)){
        const storeCreated = new this.storeModel(store);
        await storeCreated.save();
            component.store.push(storeCreated);
            return await component.save();
        }else return Error

    }

    async findByCode(code: Number){
        return await this.storeModel.find({code: code}).exec(); 
    }

    async createComponent(component: CreateComponentDto){
        return await this.componentService.create(component);
    }
    
}
