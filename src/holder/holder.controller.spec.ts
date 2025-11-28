import { Test, TestingModule } from '@nestjs/testing';
import { HolderController } from './holder.controller';
import { HolderService } from './holder.service';

describe('HolderController', () => {
  let controller: HolderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HolderController],
      providers: [HolderService],
    }).compile();

    controller = module.get<HolderController>(HolderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
