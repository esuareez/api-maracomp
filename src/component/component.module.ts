import { Module } from '@nestjs/common';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';

@Module({
  controllers: [ComponentController],
  providers: [ComponentService]
})
export class ComponentModule {}
