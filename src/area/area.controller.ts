import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';
import { ResponseMessage } from 'src/shared/interceptors/response-message.decorator';

@ApiTags('areas')
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new area' })
  @ApiBody({ type: CreateAreaDto })
  @ApiResponse({
    status: 201,
    description: 'Area created successfully',
    type: Area,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Área creada con éxito')
  async create(@Body() createAreaDto: CreateAreaDto): Promise<Area> {
    try {
      return await this.areaService.create(createAreaDto);
    } catch {
      throw new HttpException(
        'Error creating area',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all areas' })
  @ApiResponse({
    status: 200,
    description: 'List of all areas',
    type: [Area],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAll(): Promise<Area[]> {
    try {
      return await this.areaService.findAll();
    } catch {
      throw new HttpException(
        'Error getting areas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an area by ID' })
  @ApiParam({
    name: 'id',
    description: 'Area ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Area found',
    type: Area,
  })
  @ApiResponse({
    status: 404,
    description: 'Area not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string): Promise<Area> {
    try {
      const area = await this.areaService.findOne(+id);
      if (!area) {
        throw new HttpException('Area not found', HttpStatus.NOT_FOUND);
      }
      return area;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error getting area',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an area' })
  @ApiParam({
    name: 'id',
    description: 'Area ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({ type: UpdateAreaDto })
  @ApiResponse({
    status: 200,
    description: 'Area updated successfully',
    type: Area,
  })
  @ApiResponse({
    status: 404,
    description: 'Area not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Área actualizada con éxito')
  async update(
    @Param('id') id: string,
    @Body() updateAreaDto: UpdateAreaDto,
  ): Promise<Area> {
    try {
      const area = await this.areaService.update(+id, updateAreaDto);
      if (!area) {
        throw new HttpException('Area not found', HttpStatus.NOT_FOUND);
      }
      return area;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error updating area',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an area' })
  @ApiParam({
    name: 'id',
    description: 'Area ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Area deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Area deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Area not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Área eliminada con éxito')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const result = await this.areaService.remove(+id);
      if (!result) {
        throw new HttpException('Area not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Area deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error deleting area',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
