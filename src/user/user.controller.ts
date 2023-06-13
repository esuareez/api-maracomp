import { Controller, Get, Post, Body, ValidationPipe, Put, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user-dto';
import { updateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post()
    async create(@Body(new ValidationPipe()) createUser: createUserDto){
        return this.userService.create(createUser);
    }

    @Put(':id') // indicar que recibe este parametro
    async update(@Param('id') id: string,   @Body(new ValidationPipe()) updateUser : updateUserDto){
        return this.userService.update(id, updateUser);
    }

    @Get()
    async findAll(){
        return this.userService.findAll();
    }

    @Get('id/:id')
    async findOne(@Param('id') id: string){
        return this.userService.findOne(id);
    }

    @Get('username/:username')
    async findByUsername(@Param('username') username: string){
        return this.userService.findByUsername(username);
    }
}
