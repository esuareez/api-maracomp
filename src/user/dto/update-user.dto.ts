import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class updateUserDto {
    @IsString()
    @IsOptional()
    name?: string;
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    username?: string;
    @IsNotEmpty()
    @IsOptional()
    password?: string;
}