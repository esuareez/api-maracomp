import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  // Modulo de mongoose al modulo de nuestra app para poder usar mongo.
  // forRoot define config de la conexion a mongo.
  imports: [MongooseModule.forRoot('mongodb+srv://eliamps07:eliam123@cluster0.jupsou2.mongodb.net/maracompdb?retryWrites=true&w=majority'), 
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
