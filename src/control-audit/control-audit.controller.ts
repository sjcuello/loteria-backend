import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ControlAuditService } from './control-audit.service';
import { CreateControlAuditDto } from './dto/create-control-audit.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ControlAudit } from './entities/control-audit.entity';
import { PaginatedResponse } from '../shared/interfaces/paginated-response.interface';
import { PaginationControlAuditDto } from './dto/pagination-control-audit.dto';

@ApiTags('control-audit')
@ApiBearerAuth()
@Controller('control-audit')
export class ControlAuditController {
  constructor(private readonly controlAuditService: ControlAuditService) {}

  @Post()
  @ApiOperation({ summary: 'Create a audit control' })
  @ApiBody({ type: CreateControlAuditDto })
  @ApiResponse({
    status: 201,
    description: 'Audit control created successfully',
    type: ControlAudit,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  create(@Body() createControlAuditDto: CreateControlAuditDto) {
    return this.controlAuditService.create(createControlAuditDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all controls with pagination',
    description: 'Returns a paginated list of all audit controls',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all audit controls',
    type: [ControlAudit],
  })
  findAll(
    @Query() paginationDto: PaginationControlAuditDto,
  ): Promise<PaginatedResponse<ControlAudit>> {
    return this.controlAuditService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a audit control by ID' })
  @ApiParam({
    name: 'id',
    description: 'Audit control ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Audit control found',
    type: ControlAudit,
  })
  @ApiResponse({
    status: 404,
    description: 'Audit control not found',
  })
  findOne(@Param('id') id: string) {
    return this.controlAuditService.findOne(+id);
  }
}
