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
import { HolderService } from './holder.service';
import { CreateHolderDto } from './dto/create-holder.dto';
import { UpdateHolderDto } from './dto/update-holder.dto';
import { Holder } from './entities/holder.entity';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { PaginatedResponse } from '../shared/interfaces/paginated-response.interface';
import { ResponseMessage } from 'src/shared/interceptors/response-message.decorator';

@ApiTags('holders')
@ApiBearerAuth()
@Controller('holder')
export class HolderController {
  constructor(private readonly holderService: HolderService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new holder',
    description: 'Creates a new holder with personal and business information',
  })
  @ApiBody({
    type: CreateHolderDto,
    description:
      'Holder data including name, CUIT, and optional contact information',
  })
  @ApiResponse({
    status: 201,
    description: 'Holder created successfully',
    type: Holder,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Usuario contribuyente creado con éxito')
  create(@Body() createHolderDto: CreateHolderDto) {
    return this.holderService.create(createHolderDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all holders with pagination',
    description: 'Returns a paginated list of all registered holders',
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
    description: 'Paginated list of holders',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Holder' },
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
  ): Promise<PaginatedResponse<Holder>> {
    return this.holderService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a holder by ID',
    description: 'Returns the information of a specific holder by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Holder ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Holder found',
    type: Holder,
  })
  @ApiResponse({
    status: 404,
    description: 'Holder not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.holderService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a holder',
    description: 'Updates the information of an existing holder',
  })
  @ApiParam({
    name: 'id',
    description: 'Holder ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateHolderDto,
    description: 'Holder data to update (all fields are optional)',
  })
  @ApiResponse({
    status: 200,
    description: 'Holder updated successfully',
    type: Holder,
  })
  @ApiResponse({
    status: 404,
    description: 'Holder not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Datos de contibuyente actualizados con éxito')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHolderDto: UpdateHolderDto,
  ) {
    return this.holderService.update(id, updateHolderDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a holder',
    description: 'Deletes a holder from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Holder ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Holder deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Holder not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Contribuyente inhabilitado con éxito')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.holderService.remove(id);
  }

  @Post('from-dgr-files')
  @ApiOperation({
    summary: 'Import holders from tmp files',
  })
  @ApiResponse({
    status: 200,
    description: 'Holders imported successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Holders not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  importHoldersFromFiles() {
    return this.holderService.importHoldersFromFiles();
  }
}
