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
        @InjectModel('DetailOrder') private readonly detailOrderModel: Model<DetailOrder>,
        private readonly storeService : StoreService,
        private readonly supplierTimeService : SupplierTimeService,
        private readonly inventoryMovementService : InventorymovementService,
        private readonly orderService : OrderService 
    ){}

    async create(orderRequest : any, orderRequestId: string){
        const {date, priority, detail} = orderRequest;
        const newDate = new Date(date);
        const dateNow = new Date();
        switch(priority){
            case OrderRequestPriority.CHEAP:
                for( let _detail of detail){
                    const {componentId, quantity, storeId, unit} = _detail;
                    const suppliersTimeComponent = await this.supplierTimeService.findAllComponents(componentId);
                    const suppliersCheaper = await suppliersTimeComponent.sort((sup) => sup.price);
                    let supplierCheaper = null; // Suplidor mas barato
                    let maxDate; // Fecha maxima para hacer el pedido

                    //Paso 1: Buscar el proveedor mas barato que tenga el componente y que este activo
                    for( let supCheap of suppliersCheaper){
                        const supDays = newDate.getTime() - (supCheap.deliveryTimeInDays * 24 * 60 * 60 * 1000);
                        console.log(supDays)
                        maxDate = new Date(supDays);
                        if(dateNow.getTime() <= maxDate.getTime() && supCheap.state === true){
                            supplierCheaper = supCheap;
                            break;
                        }
                    }
                    
                    if(supplierCheaper !== null){
                        //Paso 2: Buscar si existe otra orden generada pendiente con los mismos datos
                        const existOrder = await this.orderService.findOrderBySupplierOrderRequestAndDate(supplierCheaper._id, orderRequestId, maxDate);
                        const existOrdenDetail = existOrder !== null ?  await this.findOrderDetail(componentId, storeId, unit, Number(existOrder.code)) : null;
                        if(existOrdenDetail === null ){
                            //Paso 3: Buscar la cantidad en almacen y restarla con la requerida
                            const _store = await this.storeService.findStoreByComponentAndStore(componentId, storeId);
                            const { balance } = _store;
                            const newBalance = quantity - balance;
                            if(newBalance > 0){
                                //Paso 4: Crear la orden y la orden de compra
                                //Paso 4.1: Comprobar que no haya otra orden con el mismo proveedor y fecha
                                // Si no existe, crea la orden y el detalle.
                                if(existOrder === null){
                                    const _order = await this.orderService.create({
                                        code: await this.orderService.generateCode(),
                                        supplierId: supplierCheaper._id,
                                        date: maxDate,
                                        status: OrderStatus.PENDING,
                                        orderRequestId: orderRequestId,
                                        total: 0,
                                    })
                                    const _detailOrder = new this.detailOrderModel({
                                        code: await this.generateCode(),
                                        orderCode: _order.code,
                                        componentId: componentId,
                                        quantity: newBalance,
                                        storeId: storeId,
                                        unit: unit,
                                        discount: supplierCheaper.discount,
                                        price: supplierCheaper.price,
                                        total: (supplierCheaper.price - (supplierCheaper.price * (supplierCheaper.discount/100))) * newBalance,
                                    })
                                    await _detailOrder.save();
                                    // Sumar y actualizar el total de la orden
                                    await this.sumAllTotalWithSameOrderCode(_order)
                                    break;
                                }else{
                                    // Si existe la orden, se crea el detalle de la orden
                                    const _detailOrder = new this.detailOrderModel({
                                        code: await this.generateCode(),
                                        orderCode: existOrder.code,
                                        componentId: componentId,
                                        quantity: newBalance,
                                        storeId: storeId,
                                        unit: unit,
                                        discount: supplierCheaper.discount,
                                        price: supplierCheaper.price,
                                        total: (supplierCheaper.price - (supplierCheaper.price * (supplierCheaper.discount/100))) * newBalance,
                                    })
                                    await _detailOrder.save();
                                    // Sumar y actualizar el total de la orden
                                    await this.sumAllTotalWithSameOrderCode(existOrder)
                                    break;
                                }
                            }else{
                                break;
                            }
                        }
                    }else{
                        break;
                    }
                }
                break;
            case OrderRequestPriority.FASTER:
                break;
        }
    }

    async findAll(){
        return await this.detailOrderModel.find().exec();
    }

    async findOrderDetail(componentId: string, storeId: string, unit: string, orderCode?: number){
        const detailOrders = await this.findAll();
        for(let detail of detailOrders){
            if(componentId === detail.componentId && storeId === detail.storeId && unit === detail.unit && orderCode === detail.orderCode){
                const order = await this.orderService.findByCode(detail.orderCode);
                if(order.status === OrderStatus.PENDING){
                    return detail;
                }
            }
        }
        return null;
    }

    async generateCode(){
        const lastOrder = await this.findAll()
        return lastOrder.length + 1 
    }

    async sumAllTotalWithSameOrderCode(order: any){
        console.log(order)
        const detailOrders = await this.findAll();
        let total = 0;
        for(let detail of detailOrders){
            if(detail.orderCode === order.code){
                total += detail.total;
            }
        }
        order.total = total;
        return await this.orderService.update(order._id.toString(), order);
    }
}
