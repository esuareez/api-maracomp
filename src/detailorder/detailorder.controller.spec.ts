import { Test, TestingModule } from '@nestjs/testing';
import { DetailorderController } from './detailorder.controller';

describe('DetailorderController', () => {
  let controller: DetailorderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailorderController],
    }).compile();

    controller = module.get<DetailorderController>(DetailorderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
