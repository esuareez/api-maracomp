import { Body, Controller, Post, ValidationPipe, Get, Delete } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';

@Controller('component')
export class ComponentController {
    constructor(private componentService : ComponentService) {}

    /*@Post()
    async create(@Body(new ValidationPipe()) component: CreateComponentDto){
        return await this.componentService.create(component);
    }*/

    @Get()
    async findAll(){
        return await this.componentService.findAll();
    }

    @Get(':id')
    async findStorebyId(@Body(new ValidationPipe()) id: string){
        return await this.componentService.findStore(id);
    }
    
    @Delete()
    async deleteAll(){
        return await this.componentService.deleteAll();
    }
}
