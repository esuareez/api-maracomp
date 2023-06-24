import { Controller } from '@nestjs/common';
import { DispachService } from './dispach.service';
import { Get, Post, Put, Body, ValidationPipe } from '@nestjs/common';
import { CreateDispachDto } from './dto/create-dispach.dto';
import { Dispach } from './schema/dispach.schema';

@Controller('dispach')
export class DispachController {
    constructor(private readonly dispachService: DispachService){}

    @Get()
    async findAll(){
        return await this.dispachService.findAll();
    }

    @Post()
    async create(@Body(new ValidationPipe()) dispach : Dispach){
        return await this.dispachService.create(dispach);
    }
}
