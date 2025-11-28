import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { Visitor } from './entities/visitor.entity';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { PaginatedResponse } from '../shared/interfaces/paginated-response.interface';
import { ResponseMessage } from 'src/shared/interceptors/response-message.decorator';

@ApiTags('visitors')
@ApiBearerAuth()
@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new visitor',
    description: 'Creates a new visitor with personal and business information',
  })
  @ApiBody({
    type: CreateVisitorDto,
    description:
      'Visitor data including name, CUIT, and optional contact information',
  })
  @ApiResponse({
    status: 201,
    description: 'Visitor created successfully',
    type: Visitor,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Visitante creado con éxito')
  create(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorService.create(createVisitorDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all visitors with pagination',
    description: 'Returns a paginated list of all registered visitors',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starts from 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (max 100)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of visitors',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Visitor' },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 10 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Visitor>> {
    return this.visitorService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a visitor by ID',
    description: 'Returns the information of a specific visitor by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Visitor ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Visitor found',
    type: Visitor,
  })
  @ApiResponse({
    status: 404,
    description: 'Visitor not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.visitorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a visitor',
    description: 'Updates the information of an existing visitor',
  })
  @ApiParam({
    name: 'id',
    description: 'Visitor ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateVisitorDto,
    description: 'Visitor data to update (all fields are optional)',
  })
  @ApiResponse({
    status: 200,
    description: 'Visitor updated successfully',
    type: Visitor,
  })
  @ApiResponse({
    status: 404,
    description: 'Visitor not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Datos de visitante actualizados con éxito')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVisitorDto: UpdateVisitorDto,
  ) {
    return this.visitorService.update(id, updateVisitorDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a visitor',
    description: 'Deletes a visitor from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Visitor ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Visitor deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Visitor not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Visitante inhabilitado con éxito')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.visitorService.remove(id);
  }
}
