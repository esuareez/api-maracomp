import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schema/user.schema';
import { createUserDto } from './dto/create-user-dto';
import { updateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>){}

    // Crear los usuarios y guardarlos en la BD.
    async create(user : createUserDto){
        const createdUser = new this.userModel(user);
        return createdUser.save(); // se guarda en la BD.
    }

    // Actualizar usuarios y guardar en la BD.
    async update(id: string, user : updateUserDto){
        // Como no se crea una constante, para buscarla en la BD, se usa el metodo findByIdAndUpdate 
        // directamente y al final se indica exec() para poder realizar la consulta.
        return this.userModel.findByIdAndUpdate(id, user, {new: true}).exec();
    }

    async findAll(){
        return this.userModel.find().exec();
    }

    async findOne(id: string){
        return this.userModel.findById(id).exec();
    }

    async findByUsername(username: string){
        return this.userModel.findOne({username: username}).exec();
    }

    
}
