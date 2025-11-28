import { Test, TestingModule } from '@nestjs/testing';
import { ControlAuditController } from './control-audit.controller';
import { ControlAuditService } from './control-audit.service';

describe('ControlAuditController', () => {
  let controller: ControlAuditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlAuditController],
      providers: [ControlAuditService],
    }).compile();

    controller = module.get<ControlAuditController>(ControlAuditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
