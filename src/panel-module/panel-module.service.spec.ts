import { Test, TestingModule } from '@nestjs/testing';
import { PanelModuleService } from './panel-module.service';

describe('PanelModuleService', () => {
  let service: PanelModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanelModuleService],
    }).compile();

    service = module.get<PanelModuleService>(PanelModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
