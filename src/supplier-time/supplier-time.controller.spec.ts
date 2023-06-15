import { Test, TestingModule } from '@nestjs/testing';
import { SupplierTimeController } from './supplier-time.controller';

describe('SupplierTimeController', () => {
  let controller: SupplierTimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierTimeController],
    }).compile();

    controller = module.get<SupplierTimeController>(SupplierTimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
