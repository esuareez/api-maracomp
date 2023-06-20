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

    async calculateInventoryMovementByStoreIdAndComponentAndDate(storeId: string, componentId: string, date: Date){
        // Calcular los movimientos de los ultimos X dias (dependiendo los dias que falten para la fecha limite del pedido)
        const dateNow = new Date();
        const dateLimit = new Date(date);
        let totalVendido = 0;
        // Calcular los dias que faltan para la fecha limite del pedido y sumarle 30 dias.
        const days = Math.round((dateLimit.getTime() - dateNow.getTime()) / (1000 * 3600 * 24));
        // Sumarle 30 dias a days para obtener la fecha limite de los movimientos de inventario.
        const nDays = days + 30;
        // Luego de obtener la diferencia de dias entre la fecha actual y la fecha limite y sumarle 30 dias, retrocedemos esa cantidad de dias
        // para asegurarnos que no se nos escape ningun movimiento de inventario y tener un margen mas grande de consumo diario.
        const dateMin = new Date(dateNow.getTime() - (nDays * 24 * 60 * 60 * 1000));
        console.log(`Dias que faltan para la fecha limite: ${days}`);
        console.log(`Fecha que tomamos como punto de partida para analizar los movimientos: ${dateMin}`)
        // Luego de obtener la fecha limite, buscamos los movimientos de inventario de ese componente en ese inventario.
        const inventoryMovement = await this.inventoryMovementModel.find({idStore: storeId, 'detail.idComponent': componentId, date: {$gte: dateMin, $lte: date}}).exec();
        for( let inventory of inventoryMovement){
            if(inventory.type === 'SALIDA'){
                for(let detail of inventory.detail){
                    if(detail.idComponent === componentId){
                        totalVendido += detail.quantity;
                    }
                }
            } 
        }
        // Retornamos el total consumido en los ultimos X dias
        return Math.round(totalVendido / days);
    }
}
 