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

    async create(dispach : any) {
        const createdDispach = new this.dispachModel(dispach);
        createdDispach.code = await this.generateCode();
        createdDispach.date = new Date();
      
        for (const detailItem of dispach.detail) {
          const { componentId, quantity, storeId } = detailItem;
      
          const createdStore = await this.storeService.findById(storeId);
          const createdComponent = await this.componentService.findById(componentId);
      
          for (const store of createdComponent.store) {
            console.log(`${store.store} --- ${storeId}`)
            if (store.store === storeId) {
              store.balance -= quantity;
              await this.componentService.update(componentId, createdComponent);
              break; // No es necesario seguir iterando después de encontrar la tienda correspondiente
            }
          }
      
          const inventoryMovement = {
            date: new Date(),
            idStore: storeId,
            type: 'OUT',
            detail: [
              {
                idComponent: componentId,
                quantity,
                unit: createdComponent.unit,
              },
            ],
          };
      
          await this.inventoryMovementService.create(inventoryMovement);
        }
      
        return await createdDispach.save();
      }

    async findAll(){
        return await this.dispachModel.find().exec();
    }

    async generateCode(){
        const lastCode = await this.findAll();
        return lastCode.length + 1;
    }
}
