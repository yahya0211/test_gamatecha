import { Test, TestingModule } from '@nestjs/testing';
import { CafeController } from '../cafe/cafe.controller';
import { CafeService } from '../cafe/cafe.service';

describe('CafeController', () => {
  let controller: CafeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CafeController],
      providers: [CafeService],
    }).compile();

    controller = module.get<CafeController>(CafeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
