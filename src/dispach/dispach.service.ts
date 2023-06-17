import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dispach } from './schema/dispach.schema';
import { Model } from 'mongoose';
import { CreateDispachDto } from './dto/create-dispach.dto';
import { InventorymovementService } from 'src/inventorymovement/inventorymovement.service';
import { ComponentService } from 'src/component/component.service';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class DispachService {
    constructor(@InjectModel(Dispach.name) private readonly dispachModel : Model<Dispach>,
    private readonly inventoryMovementService : InventorymovementService,
    private readonly componentService : ComponentService,
    private readonly storeService : StoreService){}

    // Crear el despacho de un componente y afectar tabla de inventarioMovimiento
    async create(dispach: CreateDispachDto){
        // Creo el despacho
        const createdDispach = new this.dispachModel(dispach);
        createdDispach.code = await this.generateCode();
        // Obtengo el componente
        const createdComponent = await this.componentService.findById(dispach.componentId.toString());
        // Obtengo el Almacen para restar la cantidad de componentes
        const createdStore = await this.storeService.findById(dispach.storeId.toString());
        // Creo el movimiento de inventario con los datos requeridos y especificando que es una salida
        const inventoryMovement = {
            code: await this.inventoryMovementService.generateCode(),
            date: new Date(),
            idStore: createdStore._id,
            type: 'OUT',
            detail: [{
                idComponent: createdComponent._id,
                quantity: dispach.quantity,
                unit: createdComponent.unit
            }]
        }
        await this.storeService.update(createdStore._id.toString(), {balance: Number(createdStore.balance) - dispach.quantity});
        // Guardo los cambios del despacho
        createdDispach.save()
        
        // Retorno con la creacion del inventory movement
        return await this.inventoryMovementService.create(inventoryMovement);;
    }

    async findAll(){
        return await this.dispachModel.find().exec();
    }

    async generateCode(){
        const lastCode = await this.findAll();
        return lastCode.length + 1;
    }
}
