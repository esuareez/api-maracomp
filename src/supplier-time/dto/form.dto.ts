import { CreateComponentDto } from "src/component/dto/create-component.dto";
import { CreateSupplierTimeDTO } from "./create-supplierTime.dto";
import { FormComponentDTO } from "src/store/dto/form-component.dto";

export class FormDataDTO{
    formComponent: FormComponentDTO;
    supplierTime: CreateSupplierTimeDTO;
}