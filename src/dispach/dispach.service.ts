import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dispach } from './schema/dispach.schema';
import { Model } from 'mongoose';
import { CreateDispachDto } from './dto/create-dispach.dto';

@Injectable()
export class DispachService {
    constructor(@InjectModel(Dispach.name) private readonly dispachModel : Model<Dispach>){}

    async create(dispach: CreateDispachDto){
        const createdDispach = new this.dispachModel(dispach);
        return createdDispach.save();
    }
}
