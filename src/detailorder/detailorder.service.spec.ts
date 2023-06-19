import { Test, TestingModule } from '@nestjs/testing';
import { DetailorderService } from './detailorder.service';

describe('DetailorderService', () => {
  let service: DetailorderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailorderService],
    }).compile();

    service = module.get<DetailorderService>(DetailorderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
