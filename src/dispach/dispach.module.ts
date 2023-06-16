import { Module } from '@nestjs/common';
import { DispachController } from './dispach.controller';
import { DispachService } from './dispach.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { DispachSchema } from './schema/dispach.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Dispach', schema: DispachSchema }])
  ],
  controllers: [DispachController],
  providers: [DispachService]
})
export class DispachModule {}
