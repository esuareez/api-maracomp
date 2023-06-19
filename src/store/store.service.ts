import { Body, Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './schema/store.schema';
import { createStoreDTO } from './dto/create-store.dto';
import { ComponentService } from 'src/component/component.service';
import { Component } from 'src/component/schema/component.schema';
import { CreateComponentDto } from 'src/component/dto/create-component.dto';
import { isEmpty, isNotEmpty } from 'class-validator';
import { UpdateStoreDto } from './dto/update-store.dto';
import { SupplierTimeService } from 'src/supplier-time/supplier-time.service';


@Injectable()
export class StoreService {
    constructor(
         private readonly componentService : ComponentService,
         private readonly supplierTimeService : SupplierTimeService,
        @InjectModel(Store.name) private readonly storeModel : Model<Store>){}

    async create(component: any, supplierTime: any){
        console.log(`${component.store.balance} --- ${component.store.description}`)
        const allComponents = await this.componentService.findAll();
        await allComponents.map(async (element) => {
            if(element.description === component.description && element.unit === component.unit){
                return await this.agregate(element._id.toString(), component.store);
            }
        })
        const store = await this.findbyDescription(component.store.description);
        if(isEmpty(store)){
            const createdStore = new this.storeModel(component.store);
            createdStore.code = await this.generateCode();
            await createdStore.save();
            component.store = {store: createdStore._id.toString(), balance: component.store.balance};
            await this.componentService.create(component, createdStore._id.toString(), Number(component.store.balance));
        }else{
            component.store = {store: store._id.toString(), balance: component.store.balance};
            await this.componentService.create(component, store._id.toString(), Number(component.store.balance));
        }
        return await this.supplierTimeService.create({
            componentId: component._id.toString(),
            supplierCode: supplierTime.supplierCode,
            deliveryTimeInDays: supplierTime.deliveryTimeInDays,
            price: supplierTime.price,
            discount: supplierTime.discount,
            state: supplierTime.state,
        });
    }
    // Agregar un componente a un almacen
    async agregate(id: string, form: any){
        // Creo el componente y lo busco.
        const component = await this.componentService.findById(id);
        // Si no tiene problemas y el componente existe entonces:
        if(isNotEmpty(component)){
            console.log(`COMPONENTE ENCONTRADO ${component}`)
            // Busco si el almacen ya existe, por el nombre.
            const storeExist = await this.findbyDescription(form.description);
            // Si no existe entonces lo creo y lo agrego al componente.
            if(isEmpty(storeExist)){
                const storage = {
                    code: await this.generateCode(),
                    description: form.description,
                };
                const storeCreated = new this.storeModel(storage);
                await storeCreated.save();
                const store = {
                    store: storeCreated._id.toString(),
                    balance: form.balance,
                }
                component.store.push(store)
                return await this.componentService.update(id, component);
            // Si existe entonces:
            }else{
                console.log(`ALMACEN ENCONTRADO ${storeExist}`)
                component.store.map(async (element) => {
                    if(element.store === storeExist._id.toString()){
                        element.balance += form.balance;
                        return await this.componentService.update(id, component);
                    }
                }) 
            }
        }else return Error

    }

    async findStoreByComponentAndStore(componentId: string, storeId: string){
        const component = await this.componentService.findById(componentId);
        if(isNotEmpty(component)){
            const store = await this.findById(storeId);
            if(isNotEmpty(store)){
                for(let store of component.store){
                    if(store.store === storeId){
                        return store;
                    }
                }
            }else return null;
        }else return null;
    }

    async findAll(){
        return await this.storeModel.find().exec();
    }

    async generateCode(){
        const lastCode = await this.findAll();
        return lastCode.length + 1;
    }

    async update(id: string, store: UpdateStoreDto){
        return await this.storeModel.findByIdAndUpdate(id, store);
    }

    async findById(id: string){
        return await this.storeModel.findById(id);
    }

    async findbyDescription(description: string){
        return await this.storeModel.findOne({description: description});
    }
    
    async deleteAll(){
        return await this.storeModel.deleteMany();
    }
}
