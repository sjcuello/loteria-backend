import { Module } from '@nestjs/common';
import { ControlAuditService } from './control-audit.service';
import { ControlAuditController } from './control-audit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControlAudit } from './entities/control-audit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ControlAudit])],
  controllers: [ControlAuditController],
  providers: [ControlAuditService],
  exports: [ControlAuditService],
})
export class ControlAuditModule {}
