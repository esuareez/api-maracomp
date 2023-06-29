import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    private readonly componentService: ComponentService,
  ) {}

  async create(orderRequest: any) {
    const { date, detail } = orderRequest;
    const newDate = new Date(date);
    const dateNow = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // Un dia en milisegundos: 24 horas * 60 minutos * 60 segundos * 1000 milisegundos
    let ordersCreated = [];

    // Paso 1: revisar que todos los componentes cumplan con los requisitos minimos para crear una orden
    await this.checkConditionsToCreateOrder(orderRequest);

    for (let _detail of detail) {
      const { componentId, quantity, storeId, unit } = _detail;
      console.log(
        `Componente: ${componentId} Cantidad: ${quantity} Almacen: ${storeId} Unidad: ${unit}`,
      );

      // Paso 2: Buscar el proveedor mas barato y que tenga el menor tiempo de entrega posible dentro del rango.
      const _bestSupplier =
        await this.supplierTimeService.findBestActiveSupplier(componentId);
      const component = await this.componentService.findById(componentId);

      if (_bestSupplier.length === 0) {
        continue;
      }
      const _supCheaper = _bestSupplier[0];

      const supDays =
        newDate.getTime() - Number(_supCheaper?.deliveryTimeInDays) * oneDay; // Dias que tarda el suplidor en entregar el componente
      const maxDate = new Date(supDays); // Fecha maxima para hacer el pedido

      if (maxDate < dateNow) {
        continue;
      }
      // Haz la resta maxDate con Date.Now() y luego extrae la diferencia de dias, para saber cuantos dias faltan para llegar a maxDate
      const diasFaltantes = Math.round(
        (maxDate.getTime() - dateNow.getTime()) / oneDay,
      );
      console.log(diasFaltantes);
      //Paso 3: Buscar si existe otra orden, que se este creando, con los mismos datos

      const getOrder = await this.orderService.findOrderByDateAndSupplier(
        new Date(maxDate),
        _supCheaper.supplierId,
      );

      //Paso 4: Calcular el consumo diario de X cantidad de dias para estimar la cantidad a pedir

      const inventoryMovement =
        await this.inventoryMovementService.calculateInventoryMovementByStoreIdAndComponentAndDate(
          storeId,
          componentId,
          maxDate,
        );
      console.log(`Movimiento de inventario: ${inventoryMovement}`);

      //Paso 5: Buscar la cantidad en almacen y restarla con la requerida

      const existingQuantity =
        await this.getQuantityByDetailsOrdersWithSameComponentAndStoreId(
          componentId,
          storeId,
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
          (balance - Math.ceil(inventoryMovement * diasFaltantes));
      } else {
        newBalance =
          quantity - Math.ceil(balance - inventoryMovement * diasFaltantes);
      }

      if (newBalance < 0) {
        continue;
      }

      //Paso 6: Crear la orden y la orden de compra
      let _order = null;
      if (getOrder === null) {
        _order = await this.orderService.create({
          code: await this.orderService.generateCode(),
          supplierId: _supCheaper.supplierId,
          date: maxDate,
          status: OrderStatus.CREATING,
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
          Number(
            Number(_supCheaper.price) -
              Number(_supCheaper.price) * (Number(_supCheaper.discount) / 100),
          ) * newBalance,
      });
      await _detailOrder.save();

      // Sumar y actualizar el total de la orden

      await this.sumAllTotalWithSameOrderCode(
        getOrder !== null ? getOrder : _order,
      );
      getOrder !== null ? null : ordersCreated.push(_order);
    }

    // Actualizar estado de las ordenes de compra a pendiente
    for (let order of ordersCreated) {
      await this.orderService.update(order._id, {
        status: OrderStatus.PENDING,
      });
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
    return lastOrder.length + 5;
  }

  async findAllWithSameCode(code: Number) {
    return await this.detailOrderModel.find({ orderCode: code }).exec();
  }

  async getQuantityByDetailsOrdersWithSameComponentAndStoreId(
    componentId: string,
    storeId: string,
  ) {
    const aggregatePipeline: any[] = [
      {
        $lookup: {
          from: 'orders', // Nombre de la colección de pedidos
          localField: 'orderCode',
          foreignField: 'code',
          as: 'order',
        },
      },
      {
        $match: {
          componentId: componentId,
          storeId: storeId,
          'order.status': {
            $in: [OrderStatus.PENDING, OrderStatus.CREATING],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$quantity' },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
        },
      },
    ];

    const result = await this.detailOrderModel
      .aggregate<any>(aggregatePipeline)
      .exec();

    if (result.length > 0) {
      return result[0].total;
    } else {
      return 0;
    }
  }

  async sumAllTotalWithSameOrderCode(order: any) {
    const aggregatePipeline: any[] = [
      {
        $match: {
          orderCode: order.code,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ];

    const result = await this.detailOrderModel
      .aggregate<any>(aggregatePipeline)
      .exec();

    if (result.length > 0) {
      const total = result[0].total;
      order.total = total;
      return await this.orderService.update(order._id.toString(), order);
    } else {
      // No se encontraron detalles de orden para el código dado
      // Maneja el caso según tus necesidades (lanzar excepción, retornar un valor predeterminado, etc.)
      throw new Error(
        'No se encontraron detalles de orden para el código dado.',
      );
    }
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

  // Comprobar que se cumplan todas las condiciones para crear la orden de compra
  async checkConditionsToCreateOrder(orderRequest: any) {
    const { date, detail } = orderRequest;
    const newDate = new Date(date);
    const dateNow = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // Un dia en milisegundos: 24 horas * 60 minutos * 60 segundos * 1000 milisegundos

    for (let _detail of detail) {
      const { componentId, quantity, storeId, unit } = _detail;
      console.log(
        `Componente: ${componentId} Cantidad: ${quantity} Almacen: ${storeId} Unidad: ${unit}`,
      );

      // Paso 1: Buscar el proveedor mas barato y que tenga el menor tiempo de entrega posible dentro del rango.
      const _bestSupplier =
        await this.supplierTimeService.findBestActiveSupplier(componentId);
      const component = await this.componentService.findById(componentId);
      if (_bestSupplier.length === 0) {
        throw new NotFoundException(
          `No se encontró proveedor para el componente: ${component?.description}`,
        );
      }

      const _supCheaper = _bestSupplier[0];

      const supDays =
        newDate.getTime() - Number(_supCheaper?.deliveryTimeInDays) * oneDay; // Dias que tarda el suplidor en entregar el componente
      const maxDate = new Date(supDays); // Fecha maxima para hacer el pedido
      if (maxDate < dateNow) {
        throw new NotFoundException(
          `Se encontraron proveedores, pero ninguno cumple con la fecha requerida para el componente: ${component?.description}`,
        );
      }

      //Paso 2: Calcular el consumo diario de X cantidad de dias para estimar la cantidad a pedir

      const inventoryMovement =
        await this.inventoryMovementService.calculateInventoryMovementByStoreIdAndComponentAndDate(
          storeId,
          componentId,
          maxDate,
        );
      console.log(`Movimiento de inventario: ${inventoryMovement}`);

      //Paso 3: Buscar la cantidad en almacen y restarla con la requerida

      const existingQuantity =
        await this.getQuantityByDetailsOrdersWithSameComponentAndStoreId(
          componentId,
          storeId,
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
          (balance - Math.ceil(inventoryMovement * supDays));
      } else {
        newBalance =
          quantity - Math.ceil(balance - inventoryMovement * supDays);
      }

      if (newBalance < 0) {
        throw new NotFoundException(
          `La cantidad existente en almacén y ordenes en proceso suple la necesidad del componente: ${component?.description}`,
        );
      }
    }
  }

  async completeOrder(orderId: any) {
    const order = await this.orderService.findById(orderId);
    const details = await this.findAllByOrderCode(order.code);
    for (let detail of details) {
      const { componentId, quantity, storeId, unit } = detail;
      await this.storeService.findStoreInComponentAndSumBalance(
        componentId,
        storeId,
        quantity,
      );
    }
    order.status = OrderStatus.COMPLETED;
    return await this.orderService.update(orderId, order);
  }

  async sumTotalOfAllOrders() {
    const aggregatePipeline: any[] = [
      {
        $group: {
          _id: null,
          totalSum: { $sum: '$total' },
        },
      },
    ];

    const aggregateResult = await this.detailOrderModel
      .aggregate<any>(aggregatePipeline)
      .exec();
    if (aggregateResult.length === 0) {
      return 0;
    }
    return aggregateResult[0].totalSum;
  }

  async bestSellingComponent() {
    const aggregatePipeline: any[] = [
      { $group: { _id: '$componentId', totalSold: { $sum: '$quantity' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 1 },
    ];

    const aggregateResult = await this.detailOrderModel
      .aggregate<any>(aggregatePipeline)
      .exec();
    if (aggregateResult.length === 0) {
      return null;
    }
    const component = await this.componentService.findById(
      aggregateResult[0]._id,
    );
    return component;
  }

  async mostImportantStores() {
    const aggregatePipeline: any[] = [
      {
        $group: {
          _id: '$storeId',
          orderCount: { $sum: 1 },
          totalOrders: { $sum: '$total' },
        },
      },
      { $sort: { totalOrders: -1, orderCount: -1 } },
      { $limit: 5 },
    ];

    const aggregateResult = await this.detailOrderModel
      .aggregate<any>(aggregatePipeline)
      .exec();
    if (aggregateResult.length === 0) {
      return null;
    }
    const stores = [];
    for (let store of aggregateResult) {
      const _store = await this.storeService.findById(store._id);
      stores.push(_store);
    }
    return stores;
  }
}
