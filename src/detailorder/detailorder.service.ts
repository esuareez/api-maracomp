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
                    console.log(`Componente: ${componentId} Cantidad: ${quantity} Almacen: ${storeId} Unidad: ${unit}`)
                    const suppliersTimeComponent = await this.supplierTimeService.findAllComponents(componentId);
                    await suppliersTimeComponent.sort((sup1, sup2) => sup1.price - sup2.price); // revisar.
                    let supplierCheaper = null; // Suplidor mas barato
                    let maxDate; // Fecha maxima para hacer el pedido
                    let supDays; // Dias que tarda el suplidor en entregar el componente

                    //Paso 1: Buscar el proveedor mas barato que tenga el componente y que este activo
                    for( let supCheap of suppliersTimeComponent){
                        supDays = newDate.getTime() - (supCheap.deliveryTimeInDays * 24 * 60 * 60 * 1000);
                        console.log(supDays)
                        maxDate = new Date(supDays);
                        if(dateNow.getTime() <= maxDate.getTime() && supCheap.state === true){
                            supplierCheaper = supCheap;
                            break;
                        }
                    }
                    
                    if(supplierCheaper !== null){
                        
                        //Paso 2: Buscar si existe otra orden generada pendiente con los mismos datos
                        const getOrder = await this.orderService.findOrderByDateRequestAndSupplier(new Date(maxDate), orderRequestId, supplierCheaper.id.toString());
                        const existOrdenDetail =  getOrder !== null ? await this.findOrderDetailByOrder(componentId, storeId, unit, getOrder.code) : null;
                        
                        
                        if(existOrdenDetail === null){
                            //Paso 3: Calcular el consumo diario de X cantidad de dias para estimar la cantidad a pedir
                            const inventoryMovement = await this.inventoryMovementService.calculateInventoryMovementByStoreIdAndComponentAndDate(storeId, componentId, maxDate);
                            console.log(`Movimiento de inventario: ${inventoryMovement}`)
                            //Paso 4: Buscar la cantidad en almacen y restarla con la requerida
                            // FALTA COMPROBAR SI HAY MAS ORDENES PENDIENTES CON EL MISMO COMPONENTE Y ALMACEN EN FECHAS ANTERIORES, 
                            // PARA ASI SACAR LA CANTIDAD QUE SE HA PEDIDO ANTERIORMENTE Y SABER CON CUANTO COMPLETAR LA CANTIDAD REQUERIDA
                            const existingQuantity = await this.getQuantityByDetailsOrdersWithSameComponentAndStoreId(componentId, storeId, maxDate);
                            const _store = await this.storeService.findStoreByComponentAndStore(componentId, storeId);
                            const { balance } = _store;
                            let newBalance = 0;
                            if(existingQuantity > 0){
                                newBalance = quantity - existingQuantity;
                                newBalance -= (balance - (inventoryMovement * (supDays / 24 * 60 * 60 * 1000)));
                            }else{
                                newBalance = quantity - (balance - (inventoryMovement * (supDays / 24 * 60 * 60 * 1000)));
                            }
                            console.log(`Cantidad a pedir: ${newBalance}`)
                            if(newBalance > 0){
                                //Paso 4: Crear la orden y la orden de compra
                                //Paso 4.1: Comprobar que no haya otra orden con el mismo proveedor y fecha
                                // Si no existe, crea la orden y el detalle.
                                if(getOrder === null){
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
                                }else{
                                    // Si existe la orden, se crea el detalle de la orden
                                    const _detailOrder = new this.detailOrderModel({
                                        code: await this.generateCode(),
                                        orderCode: getOrder.code,
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
                                    await this.sumAllTotalWithSameOrderCode(getOrder)
                                }
                            }else{
                                
                            }
                        }else{
                            // Paso 5:
                            // Sumar la cantidad del detalle con la cantidad requerida
                            const { code, orderCode, storeId, componentId, quantity, price, unit, discount, total, _id} = existOrdenDetail
                            const quantityInStore = await this.storeService.findStoreByComponentAndStore(componentId, storeId);
                            // Sumar la nueva cantidad que se va a solicitar y actualizarla en el cuerpo de la orden
                            const existingQuantity = await this.getQuantityByDetailsOrdersWithSameComponentAndStoreId(componentId, storeId, maxDate);
                            const inventoryMovement = await this.inventoryMovementService.calculateInventoryMovementByStoreIdAndComponentAndDate(storeId, componentId, maxDate);
                            let newQuantity = 0;
                            if(existingQuantity > 0){
                                newQuantity = _detail.quantity - existingQuantity - quantity;
                                if(newQuantity < 0) break;
                                newQuantity -= (quantityInStore.balance - (inventoryMovement * (supDays / 24 * 60 * 60 * 1000)));
                                newQuantity += quantity;
                            }else{
                                newQuantity = (_detail.quantity - quantity - (quantityInStore.balance - (inventoryMovement * (supDays / 24 * 60 * 60 * 1000)))) + quantity;
                            }
                            const newTotal = (price - (price * (discount/100))) * newQuantity;
                            await this.update(_id.toString(), {
                                code: code,
                                orderCode: orderCode,
                                storeId: storeId,
                                componentId: componentId,
                                quantity: newQuantity,
                                price: price,
                                unit: unit,
                                discount: discount,
                                total: newTotal,
                            });
                            // Sumar y actualizar el total de la orden
                            const order = await this.orderService.findByCode(orderCode);
                            await this.sumAllTotalWithSameOrderCode(order)
                            
                        }
                    }
                }
                break;
            case OrderRequestPriority.FASTER:
                break;    
        }
    }

    async update(id: string, detailOrder : any){
        return await this.detailOrderModel.findByIdAndUpdate(id, detailOrder, {new: true}).exec();
    }

    async findAll(){
        return await this.detailOrderModel.find().exec();
    }

    async findOrderDetailByOrder(componentId: string, storeId: string, unit: string, orderCode: Number){
        const detailOrders = await this.findAll();
        const order = await this.orderService.findByCode(orderCode);
        for(let detail of detailOrders){
            if(componentId === detail.componentId && storeId === detail.storeId && unit === detail.unit 
                && order.status === OrderStatus.PENDING && orderCode === detail.orderCode){
                    return detail;
            }
        }
        return null;
    }

    async generateCode(){
        const lastOrder = await this.findAll()
        return lastOrder.length + 1 
    }

    async findAllWithSameCode(code: Number){
        return await this.detailOrderModel.find({orderCode: code}).exec();
    }

    async getQuantityByDetailsOrdersWithSameComponentAndStoreId(componentId: string, storeId: string, date: Date){
        const detailOrders = await this.detailOrderModel.find({componentId: componentId, storeId: storeId});
        let details = [];
        let total = 0;
        for(let detail of detailOrders){
            const order = await this.orderService.findByCode(detail.orderCode);
            if(order.status === OrderStatus.PENDING && order.date <= date){
                total += detail.quantity;
            }
        }
        return total;
    }

    async sumAllTotalWithSameOrderCode(order: any){
        console.log(order)
        const detailOrders = await this.findAllWithSameCode(order.code);
        let total = 0;
        for(let detail of detailOrders){
            total += detail.total;
        }
        order.total = total;
        return await this.orderService.update(order._id.toString(), order);
    }
}
