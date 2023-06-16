import { Test, TestingModule } from '@nestjs/testing';
import { InventorymovementService } from './inventorymovement.service';

describe('InventorymovementService', () => {
  let service: InventorymovementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventorymovementService],
    }).compile();

    service = module.get<InventorymovementService>(InventorymovementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
