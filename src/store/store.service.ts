import { Body, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './schema/store.schema';
import { createStoreDTO } from './dto/create-store.dto';
import { ComponentService } from 'src/component/component.service';


@Injectable()
export class StoreService {
    constructor(@InjectModel(Store.name) private storeModel: Model<Store>, private readonly componentService : ComponentService){}

    async create(@Body('id') id: string, store : createStoreDTO){
        const createdStore = new this.storeModel(store);
        const component = this.componentService.findById(id);
        return (await component).store.push(createdStore);
    }

    async findByCode(code: Number){
        return await this.storeModel.find({code: code}).exec(); 
    }
    
}
