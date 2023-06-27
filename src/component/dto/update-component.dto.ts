import {Store } from "src/store/schema/store.schema";
import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

//especificamos como tienen q ser los atributos al hacer update
export class UpdateComponentDTO{
    @IsOptional()
    @IsString()
    code?: string
    @IsOptional()
    @IsString()
    description?: string
    @IsNumber()
    @IsOptional()
    unit?: Number
    @IsOptional()
    store?: [{
        store?: string,
        balance?: number}]
}