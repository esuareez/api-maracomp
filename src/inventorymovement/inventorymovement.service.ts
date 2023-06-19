import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InventoryMovement } from './schema/inventorymovement.schema';
import { Model } from 'mongoose';
import { CreateInventoryMovementDto } from './dto/create-inventorymovement.dto';

@Injectable()
export class InventorymovementService {
    constructor(@InjectModel(InventoryMovement.name) private readonly inventoryMovementModel : Model<InventoryMovement>) {}

    async create(inventoryMovement: any){
        inventoryMovement.code = await this.generateCode();
        const newInventoryMovement = new this.inventoryMovementModel(inventoryMovement);
        return await newInventoryMovement.save();
    }

    async generateCode(){
        const lastCode = await this.findAll();
        return lastCode.length + 1;
    }

    async findAll(){
        return await this.inventoryMovementModel.find().exec();
    }

    async deleteAll(){
        return await this.inventoryMovementModel.deleteMany().exec();
    }
}
