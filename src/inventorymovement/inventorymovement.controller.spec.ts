import { Test, TestingModule } from '@nestjs/testing';
import { InventorymovementController } from './inventorymovement.controller';

describe('InventorymovementController', () => {
  let controller: InventorymovementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventorymovementController],
    }).compile();

    controller = module.get<InventorymovementController>(InventorymovementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
