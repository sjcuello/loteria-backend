import { Test, TestingModule } from '@nestjs/testing';
import { PanelModuleController } from './panel-module.controller';
import { PanelModuleService } from './panel-module.service';

describe('PanelModuleController', () => {
  let controller: PanelModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PanelModuleController],
      providers: [PanelModuleService],
    }).compile();

    controller = module.get<PanelModuleController>(PanelModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
