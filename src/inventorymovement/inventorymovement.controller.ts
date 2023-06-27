import { Controller } from '@nestjs/common';
import { InventoryMovement } from './schema/inventorymovement.schema';
import { InventorymovementService } from './inventorymovement.service';
import { Get, Post, Delete } from '@nestjs/common';

@Controller('inventorymovement')
export class InventorymovementController {
  constructor(
    private readonly inventoryMovementService: InventorymovementService,
  ) {}

  @Delete()
  async deleteAll() {
    return await this.inventoryMovementService.deleteAll();
  }

  @Get()
  async findAll() {
    return await this.inventoryMovementService.findAll();
  }
}
