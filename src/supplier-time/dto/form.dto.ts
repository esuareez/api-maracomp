import { CreateComponentDto } from "src/component/dto/create-component.dto";
import { CreateSupplierTimeDTO } from "./create-supplierTime.dto";

export class FormDataDTO{
    component: CreateComponentDto;
    supplierTime: CreateSupplierTimeDTO;
    supplier: any;
}