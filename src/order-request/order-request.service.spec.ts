import { Test, TestingModule } from '@nestjs/testing';
import { OrderRequestService } from './order-request.service';

describe('OrderRequestService', () => {
  let service: OrderRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderRequestService],
    }).compile();

    service = module.get<OrderRequestService>(OrderRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
