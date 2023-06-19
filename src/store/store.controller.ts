import { Controller, Post, Body, ValidationPipe, Put, Param, Get, Delete } from '@nestjs/common';
import { createStoreDTO } from './dto/create-store.dto';
import { StoreService } from './store.service';
import { CreateComponentDto } from 'src/component/dto/create-component.dto';

@Controller('store')
export class StoreController {
    constructor(private readonly storeService : StoreService){}

    @Post()
    async create(@Body(new ValidationPipe) component : any){
        return this.storeService.create(component);
    }

    @Post(':id')
    async agregate(@Body(new ValidationPipe) store: createStoreDTO, @Param('id') id: string){
        console.log(store)
        console.log(id)
        return this.storeService.agregate(id, store);
    }

    @Get(':id')
    async findById(@Param('id') id: string){
        return this.storeService.findById(id);
    }

    @Delete()
    async deleteAll(){
        return this.storeService.deleteAll();
    }

    @Get()
    async findAll(){
        return this.storeService.findAll();
    }
}
