import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Component } from './schema/component.schema';
import { Error, Model } from 'mongoose';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDTO } from './dto/update-component.dto';
import { InventorymovementService } from 'src/inventorymovement/inventorymovement.service';
import { InventoryMovement, InventoryMovementType } from 'src/inventorymovement/schema/inventorymovement.schema';


@Injectable()
export class ComponentService {
    constructor(@InjectModel(Component.name) private componentModel: Model<Component>,
    private readonly inventorymovementService : InventorymovementService,
   ) {}

    // Crear un componente //
    async create(component: any, id: string, balance: number){
        const createdComponent = new this.componentModel(component);
        createdComponent.code = `C-${await this.generateCode()}`;
        await createdComponent.save()
        const createdMovement = {
            code: await this.inventorymovementService.generateCode(),
            date: new Date(),
            idStore: id,
            type: InventoryMovementType.IN,
            detail: [{
                idComponent: createdComponent._id,
                quantity: balance,
                unit: createdComponent.unit
            }]
        }
        await this.inventorymovementService.create(createdMovement);
        return createdComponent;
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
    
    async generateCode(){
        const lastCode = await this.findAll();
        return lastCode.length + 1;
    }

    async findStore(id: string){
        return await this.componentModel.find({storeId: id}).exec();
    }

    async deleteAll(){
        return await this.componentModel.deleteMany({}).exec();
    }
}
