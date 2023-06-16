import { Test, TestingModule } from '@nestjs/testing';
import { DispachController } from './dispach.controller';

describe('DispachController', () => {
  let controller: DispachController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DispachController],
    }).compile();

    controller = module.get<DispachController>(DispachController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
