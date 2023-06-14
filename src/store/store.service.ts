import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './schema/store.schema';
import { createStoreDTO } from './dto/create-store.dto';


@Injectable()
export class StoreService {
    constructor(@InjectModel(Store.name) private storeModel: Model<Store>){}

    async create(store : createStoreDTO){
        const createdStore = new this.storeModel(store);
        return createdStore.save();
    }

    async findByCode(code: Number){
        return await this.storeModel.find({code: code}).exec(); 
    }
    
}
