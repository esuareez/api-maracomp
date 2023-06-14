import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createStoreDTO{

    @IsNotEmpty()
    @IsNumber()
    code: Number
    @IsNotEmpty()
    @IsString()
    description: string
    @IsNotEmpty()
    @IsNumber()
    balance: Number
}