import { Test, TestingModule } from '@nestjs/testing';
import { DispachService } from './dispach.service';

describe('DispachService', () => {
  let service: DispachService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DispachService],
    }).compile();

    service = module.get<DispachService>(DispachService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
