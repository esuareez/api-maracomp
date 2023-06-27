import { IsNotEmpty, IsString, IsNumber, MaxLength, IsOptional } from "class-validator";
import { Store } from "src/store/schema/store.schema";

//especificamos los atributos cuando se hace un create
export class CreateComponentDto {
    @IsOptional()
    @IsString()
    code?: string
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    description: string
    @IsNotEmpty()
    @IsString()
    unit: string
    
}