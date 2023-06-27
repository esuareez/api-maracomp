import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DetailOrder } from './schema/detailorder.schema';
import { OrderRequestService } from 'src/order-request/order-request.service';
import { StoreService } from 'src/store/store.service';
import { ComponentService } from 'src/component/component.service';
import { SupplierService } from 'src/supplier/supplier.service';
import { SupplierTimeService } from 'src/supplier-time/supplier-time.service';
import { InventorymovementService } from 'src/inventorymovement/inventorymovement.service';
import { OrderRequest } from 'src/order-request/schema/order-request.schema';
import { OrderService } from 'src/order/order.service';
import { OrderRequestPriority } from 'src/order-request/schema/order-request.schema';
import { OrderStatus } from 'src/order/schema/order.schema';
import { IsEmpty } from 'class-validator';

@Injectable()
export class DetailorderService {
  constructor(
    @InjectModel('DetailOrder')
    private readonly detailOrderModel: Model<DetailOrder>,
    private readonly storeService: StoreService,
    private readonly supplierTimeService: SupplierTimeService,
    private readonly inventoryMovementService: InventorymovementService,
    private readonly orderService: OrderService,
  ) {}

  async create(orderRequest: any, orderRequestId: string) {
    const { date, priority, detail } = orderRequest;
    const newDate = new Date(date);
    const dateNow = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // Un dia en milisegundos: 24 horas * 60 minutos * 60 segundos * 1000 milisegundos

    for (let _detail of detail) {
      const { componentId, quantity, storeId, unit } = _detail;
      console.log(
        `Componente: ${componentId} Cantidad: ${quantity} Almacen: ${storeId} Unidad: ${unit}`,
      );
      const suppliersTimeComponent =
        await this.supplierTimeService.findAllComponents(componentId);

      const activeSuppliers = suppliersTimeComponent.filter(
        (sup) => sup.state === true,
      );
      if (activeSuppliers.length === 0) {
        continue;
      }

      // Ordenar los proveedores por precio de menor a mayor, si esta activo
      //Paso 1: Buscar el proveedor mas barato que tenga el componente y que este activo
      const _supCheaper =
        priority === OrderRequestPriority.CHEAP
          ? activeSuppliers.reduce((sup1, sup2) =>
              sup1.price < sup2.price ? sup1 : sup2,
            )
          : activeSuppliers.reduce((sup1, sup2) =>
              sup1.deliveryTimeInDays < sup2.deliveryTimeInDays ? sup1 : sup2,
            );

      if (_supCheaper === null) {
        continue;
      }

      const supDays =
        newDate.getTime() - _supCheaper.deliveryTimeInDays * oneDay; // Dias que tarda el suplidor en entregar el componente
      const maxDate = new Date(supDays); // Fecha maxima para hacer el pedido

      if (maxDate <= dateNow) {
        continue;
      }

      //Paso 2: Buscar si existe otra orden generada pendiente con los mismos datos
      const getOrder =
        await this.orderService.findOrderByDateRequestAndSupplier(
          new Date(maxDate),
          orderRequestId,
          _supCheaper.supplierId,
        );
      const existOrdenDetail =
        getOrder !== null
          ? await this.findOrderDetailByOrder(
              componentId,
              storeId,
              unit,
              getOrder.code,
            )
          : null;
      if (existOrdenDetail !== null) {
        continue;
      }

      //Paso 3: Calcular el consumo diario de X cantidad de dias para estimar la cantidad a pedir
      const inventoryMovement =
        await this.inventoryMovementService.calculateInventoryMovementByStoreIdAndComponentAndDate(
          storeId,
          componentId,
          maxDate,
        );
      console.log(`Movimiento de inventario: ${inventoryMovement}`);
      //Paso 4: Buscar la cantidad en almacen y restarla con la requerida
      // FALTA COMPROBAR SI HAY MAS ORDENES PENDIENTES CON EL MISMO COMPONENTE Y ALMACEN EN FECHAS ANTERIORES,
      // PARA ASI SACAR LA CANTIDAD QUE SE HA PEDIDO ANTERIORMENTE Y SABER CON CUANTO COMPLETAR LA CANTIDAD REQUERIDA
      const existingQuantity =
        await this.getQuantityByDetailsOrdersWithSameComponentAndStoreId(
          componentId,
          storeId,
          maxDate,
        );
      const _store = await this.storeService.findStoreInComponent(
        componentId,
        storeId,
      );
      const { balance } = _store;
      let newBalance = 0;

      if (existingQuantity > 0) {
        newBalance =
          quantity -
          existingQuantity -
          (balance - Math.ceil(inventoryMovement / (supDays / oneDay)));
      } else {
        newBalance =
          quantity -
          Math.ceil(
            balance -
              inventoryMovement /
                ((maxDate.getTime() - dateNow.getTime()) / oneDay),
          );
      }

      console.log(`Cantidad a pedir: ${newBalance}`);
      if (newBalance < 0) {
        continue;
      }
      //Paso 4: Crear la orden y la orden de compra
      //Paso 4.1: Comprobar que no haya otra orden con el mismo proveedor y fecha
      // Si no existe, crea la orden y el detalle.
      let _order = null;
      if (getOrder === null) {
        _order = await this.orderService.create({
          code: await this.orderService.generateCode(),
          supplierId: _supCheaper.supplierId,
          date: maxDate,
          status: OrderStatus.PENDING,
          orderRequestId: orderRequestId,
          total: 0,
        });
      }
      const _detailOrder = new this.detailOrderModel({
        code: await this.generateCode(),
        orderCode: getOrder !== null ? getOrder.code : _order.code,
        componentId: componentId,
        quantity: newBalance,
        storeId: storeId,
        unit: unit,
        discount: _supCheaper.discount,
        price: _supCheaper.price,
        total:
          (_supCheaper.price -
            _supCheaper.price * (_supCheaper.discount / 100)) *
          newBalance,
      });
      await _detailOrder.save();
      // Sumar y actualizar el total de la orden
      await this.sumAllTotalWithSameOrderCode(
        getOrder !== null ? getOrder : _order,
      );
    }
  }

  async update(id: string, detailOrder: any) {
    return await this.detailOrderModel
      .findByIdAndUpdate(id, detailOrder, { new: true })
      .exec();
  }

  async findAll() {
    return await this.detailOrderModel.find().exec();
  }

  async findOrderDetailByOrder(
    componentId: string,
    storeId: string,
    unit: string,
    orderCode: Number,
  ) {
    const detailOrders = await this.findAll();
    const order = await this.orderService.findByCode(orderCode);
    for (let detail of detailOrders) {
      if (
        componentId === detail.componentId &&
        storeId === detail.storeId &&
        unit === detail.unit &&
        order.status === OrderStatus.PENDING &&
        orderCode === detail.orderCode
      ) {
        return detail;
      }
    }
    return null;
  }

  async generateCode() {
    const lastOrder = await this.findAll();
    return lastOrder.length + 1;
  }

  async findAllWithSameCode(code: Number) {
    return await this.detailOrderModel.find({ orderCode: code }).exec();
  }

  async getQuantityByDetailsOrdersWithSameComponentAndStoreId(
    componentId: string,
    storeId: string,
    date: Date,
  ) {
    const detailOrders = await this.detailOrderModel.find({
      componentId: componentId,
      storeId: storeId,
    });
    console.log(detailOrders);
    let details = [];
    let total = 0;
    for (let detail of detailOrders) {
      const order = await this.orderService.findByCode(detail.orderCode);
      if (order.status === OrderStatus.PENDING) {
        total += detail.quantity;
      }
    }
    return total;
  }

  async sumAllTotalWithSameOrderCode(order: any) {
    console.log(order);
    const detailOrders = await this.findAllWithSameCode(order.code);
    let total = 0;
    for (let detail of detailOrders) {
      total += detail.total;
    }
    order.total = total;
    return await this.orderService.update(order._id.toString(), order);
  }

  async deleteAll() {
    return await this.detailOrderModel.deleteMany({}).exec();
  }

  async findAllByOrderCode(orderCode: Number) {
    return await this.detailOrderModel.find({ orderCode: orderCode }).exec();
  }

  async delete(id: string) {
    return await this.detailOrderModel.findByIdAndDelete(id).exec();
  }

  async deleteOrderAndDetails(orderCode: Number) {
    const details = await this.findAllByOrderCode(orderCode);
    for (let detail of details) {
      await this.delete(detail._id.toString());
    }
    return await this.orderService.deleteByCode(orderCode);
  }
}
