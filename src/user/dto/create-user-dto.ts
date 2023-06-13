import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class createUserDto {
    @IsString()
    @IsOptional()
    name?: string;
    @IsString()
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    password: string;
}