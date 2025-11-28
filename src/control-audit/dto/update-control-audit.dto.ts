import { PartialType } from '@nestjs/swagger';
import { CreateControlAuditDto } from './create-control-audit.dto';

export class UpdateControlAuditDto extends PartialType(CreateControlAuditDto) {}
