import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { createStoreDTO } from './dto/create-store.dto';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
    constructor(private readonly storeService : StoreService){}

    @Post()
    async createStore(@Body('id') id: string, @Body(new ValidationPipe) store : createStoreDTO){
        return this.storeService.create(id, store);
    }
}
