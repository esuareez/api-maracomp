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
import { FormComponentDTO } from './dto/form-component.dto';
import { InventorymovementService } from 'src/inventorymovement/inventorymovement.service';
import { InventoryMovementType } from 'src/inventorymovement/schema/inventorymovement.schema';

@Injectable()
export class StoreService {
  constructor(
    private readonly componentService: ComponentService,
    private readonly supplierTimeService: SupplierTimeService,
    private readonly inventoryMovementService: InventorymovementService,
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
  ) {}

  async create(formComponent: FormComponentDTO) {
    const { description, unit, balance, storeDesc } = formComponent;
    const storage = { description: storeDesc, balance: balance };
    let component = {
      description: description,
      unit: unit,
      store: [{ store: '', balance: 0 }],
    };
    let _component = null;
    console.log(`${balance} --- ${storeDesc}`);

    const componentFound = await this.componentService.findOne(
      description,
      unit,
    );

    // Si el componente existe
    if (isNotEmpty(componentFound)) {
      return await this.agregate(componentFound._id.toString(), storage);
    }

    const store = await this.storeModel
      .findOne({ description: storeDesc })
      .exec();
    let createdStore = null;
    if (isEmpty(store)) {
      createdStore = new this.storeModel({
        code: await this.generateCode(),
        description: storeDesc,
      });
      await createdStore.save();
    }
    component.store[0] = {
      store:
        createdStore !== null
          ? createdStore._id.toString()
          : store._id.toString(),
      balance: balance,
    };
    return (_component = await this.componentService.create(
      component,
      createdStore !== null
        ? createdStore._id.toString()
        : store._id.toString(),
      Number(balance),
    ));
  }
  // Agregar almacen a un componente.
  async agregate(id: string, form: any) {
    // Buscar el componente por id.
    const component = await this.componentService.findById(id);
    // Si no tiene problemas y el componente existe entonces:
    if (isEmpty(component)) {
      return 'El componente no existe';
    }

    console.log(`COMPONENTE ENCONTRADO ${component}`);
    // Busco si el almacen ya existe, por el nombre.
    const storeExist = await this.findbyDescription(form.description);
    // Si no existe entonces lo creo y lo agrego al componente.
    if (isEmpty(storeExist)) {
      const storage = {
        code: await this.generateCode(),
        description: form.description,
      };
      const storeCreated = new this.storeModel(storage);
      await storeCreated.save();
      const store = {
        store: storeCreated._id.toString(),
        balance: form.balance,
      };
      component.store.push(store);
      return await this.componentService.update(id, component);
      // Si existe entonces:
    }

    console.log(`ALMACEN ENCONTRADO ${storeExist}`);
    let exist = false;
    component.store.map(async (element) => {
      if (element.store === storeExist._id.toString()) {
        element.balance += form.balance;
        exist = true;
      }
    });

    if (!exist) {
      const store = {
        store: storeExist._id.toString(),
        balance: form.balance,
      };
      component.store.push(store);
    }
    return await this.componentService.update(id, component);
  }

  async findStoreInComponent(componentId: string, storeId: string) {
    const component = await this.componentService.findById(componentId);
    if (isNotEmpty(component)) {
      const store = await this.findById(storeId);
      if (isNotEmpty(store)) {
        for (let store of component.store) {
          if (store.store === storeId) {
            return store;
          }
        }
      } else return null;
    } else return null;
  }

  async findStoreInComponentAndSumBalance(
    componentId: string,
    storeId: string,
    balance: number,
  ) {
    const component = await this.componentService.findById(componentId);
    if (isNotEmpty(component)) {
      const store = await this.findById(storeId);
      if (isNotEmpty(store)) {
        for (let store of component.store) {
          if (store.store === storeId) {
            store.balance += balance;
            this.inventoryMovementService.create({
              code: await this.inventoryMovementService.generateCode(),
              date: Date.now(),
              idStore: storeId,
              type: InventoryMovementType.IN,
              detail: [
                {
                  idComponent: componentId,
                  quantity: balance,
                  unit: component.unit,
                },
              ],
            });
            return await this.componentService.update(componentId, component);
          }
        }
      } else return null;
    } else return null;
  }

  async findAll() {
    return await this.storeModel.find().exec();
  }

  async generateCode() {
    const lastCode = await this.findAll();
    return lastCode.length + 1;
  }

  async update(id: string, store: UpdateStoreDto) {
    return await this.storeModel.findByIdAndUpdate(id, store);
  }

  async findById(id: string) {
    return await this.storeModel.findById(id);
  }

  async findbyDescription(description: string) {
    return await this.storeModel.findOne({ description: description });
  }

  async deleteAll() {
    return await this.storeModel.deleteMany();
  }
}
