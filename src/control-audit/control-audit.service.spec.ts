import { Test, TestingModule } from '@nestjs/testing';
import { ControlAuditService } from './control-audit.service';

describe('ControlAuditService', () => {
  let service: ControlAuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlAuditService],
    }).compile();

    service = module.get<ControlAuditService>(ControlAuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
