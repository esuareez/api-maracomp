import { Body, Controller, Post, ValidationPipe, Get } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';

@Controller('component')
export class ComponentController {
    constructor(private componentService : ComponentService) {}

    @Post()
    async create(@Body(new ValidationPipe()) component: CreateComponentDto){
        return await this.componentService.create(component);
    }

    @Get()
    async findAll(){
        return await this.componentService.findAll();
    }
}
