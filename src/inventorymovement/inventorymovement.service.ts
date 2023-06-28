import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InventoryMovement } from './schema/inventorymovement.schema';
import { Model } from 'mongoose';
import { CreateInventoryMovementDto } from './dto/create-inventorymovement.dto';

@Injectable()
export class InventorymovementService {
  constructor(
    @InjectModel(InventoryMovement.name)
    private readonly inventoryMovementModel: Model<InventoryMovement>,
  ) {}

  async create(inventoryMovement: any) {
    inventoryMovement.code = await this.generateCode();
    const newInventoryMovement = new this.inventoryMovementModel(
      inventoryMovement,
    );
    return await newInventoryMovement.save();
  }

  async generateCode() {
    const lastCode = await this.findAll();
    return lastCode.length + 1;
  }

  async findAll() {
    return await this.inventoryMovementModel.find().exec();
  }

  async deleteAll() {
    return await this.inventoryMovementModel.deleteMany().exec();
  }

  async calculateInventoryMovementByStoreIdAndComponentAndDate(
    storeId: string,
    componentId: string,
    date: Date,
  ) {
    const dateNow = new Date();
    const dateLimit = new Date(date);
    let totalVendido = 0;

    const days = Math.round(
      (dateLimit.getTime() - dateNow.getTime()) / (1000 * 3600 * 24),
    );
    const nDays = days + 30;
    const dateMin = new Date(dateNow.getTime() - nDays * 24 * 60 * 60 * 1000);

    const aggregatePipeline: any[] = [
      {
        $match: {
          idStore: storeId,
          'detail.idComponent': componentId,
          date: { $gte: dateMin, $lte: date },
        },
      },
      {
        $project: {
          _id: 0,
          detail: {
            $filter: {
              input: '$detail',
              as: 'item',
              cond: { $eq: ['$$item.idComponent', componentId] },
            },
          },
        },
      },
      {
        $unwind: '$detail',
      },
      {
        $group: {
          _id: null,
          totalVendido: { $sum: '$detail.quantity' },
        },
      },
    ];

    const result = await this.inventoryMovementModel
      .aggregate<any>(aggregatePipeline)
      .exec();

    if (result.length > 0) {
      totalVendido = result[0].totalVendido;
    }

    return Math.ceil(totalVendido / nDays);
  }
}
