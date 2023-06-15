import { IsNotEmpty, IsString, IsNumber, MaxLength } from "class-validator";
import { Store } from "src/store/schema/store.schema";

export class CreateComponentDto {
    @IsNotEmpty()
    @IsString()
    code: string
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    description: string
    @IsNotEmpty()
    unit: Number
    
}