import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from './schema/order.schema';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(order: Order) {
    const newOrder = new this.orderModel(order);
    return await newOrder.save();
  }

  async findAll() {
    return await this.orderModel.find().exec();
  }

  async findByCodeAndDate(code: Number, date: Date) {
    return await this.orderModel.findOne({ code, date }).exec();
  }

  async findOrderByDateAndSupplier(date: Date, supplierId: string) {
    return await this.orderModel
      .findOne({ date, supplierId, status: OrderStatus.CREATING })
      .exec();
  }

  async findOrderByDateRequestAndSupplier(
    date: Date,
    orderRequestId: string,
    supplierId: string,
  ) {
    return await this.orderModel
      .findOne({ date, orderRequestId, supplierId })
      .exec();
  }

  async findByCode(code: Number) {
    return await this.orderModel.findOne({ code }).exec();
  }

  async generateCode() {
    const lastOrder = await this.findAll();
    return lastOrder.length + 1;
  }

  async findOrderBySupplierOrderRequestAndDate(
    supplierCode: string,
    orderRequestCode: string,
    date: Date,
  ) {
    return await this.orderModel
      .findOne({ supplierCode, orderRequestCode, date })
      .exec();
  }

  async updateTotalByCode(code: Number, order: Order) {
    let _order = await this.orderModel.findOne({ code }).exec();
    if (_order !== null) {
      _order.total = order.total;
    }
    return await this.orderModel
      .findByIdAndUpdate(_order._id, _order, { new: true })
      .exec();
  }

  async update(id: string, order: Order) {
    return await this.orderModel
      .findByIdAndUpdate(id, order, { new: true })
      .exec();
  }

  async deleteAll() {
    return await this.orderModel.deleteMany({}).exec();
  }

  async delete(id: string) {
    return await this.orderModel.findByIdAndDelete(id).exec();
  }

  async deleteByCode(code: Number) {
    return await this.orderModel.deleteOne({ code }).exec();
  }
}
