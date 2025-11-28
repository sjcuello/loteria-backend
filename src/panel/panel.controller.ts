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
import { PanelService } from './panel.service';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { Panel } from './entities/panel.entity';
import { ResponseMessage } from 'src/shared/interceptors/response-message.decorator';

@ApiTags('panels')
@Controller('panel')
export class PanelController {
  constructor(private readonly panelService: PanelService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new panel' })
  @ApiBody({ type: CreatePanelDto })
  @ApiResponse({
    status: 201,
    description: 'Panel created successfully',
    type: Panel,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Role not found or invalid data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Panel creado con éxito')
  async create(@Body() createPanelDto: CreatePanelDto): Promise<Panel> {
    try {
      return await this.panelService.create(createPanelDto);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Role not found')) {
        throw new HttpException('Role not found', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Error creating panel',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all panels' })
  @ApiResponse({
    status: 200,
    description: 'List of all panels',
    type: [Panel],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAll(): Promise<Panel[]> {
    try {
      return await this.panelService.findAll();
    } catch {
      throw new HttpException(
        'Error getting panels',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a panel by ID' })
  @ApiParam({
    name: 'id',
    description: 'Panel ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Panel found',
    type: Panel,
  })
  @ApiResponse({
    status: 404,
    description: 'Panel not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string): Promise<Panel> {
    try {
      const panel = await this.panelService.findOne(+id);
      if (!panel) {
        throw new HttpException('Panel not found', HttpStatus.NOT_FOUND);
      }
      return panel;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error getting panel',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a panel' })
  @ApiParam({
    name: 'id',
    description: 'Panel ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({ type: UpdatePanelDto })
  @ApiResponse({
    status: 200,
    description: 'Panel updated successfully',
    type: Panel,
  })
  @ApiResponse({
    status: 404,
    description: 'Panel not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Role not found or invalid data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Panel actualizado con éxito')
  async update(
    @Param('id') id: string,
    @Body() updatePanelDto: UpdatePanelDto,
  ): Promise<Panel> {
    try {
      const panel = await this.panelService.update(+id, updatePanelDto);
      if (!panel) {
        throw new HttpException('Panel not found', HttpStatus.NOT_FOUND);
      }
      return panel;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Role not found')) {
        throw new HttpException('Role not found', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Error updating panel',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a panel' })
  @ApiParam({
    name: 'id',
    description: 'Panel ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Panel deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Panel deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Panel not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Panel eliminado con éxito')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const result = await this.panelService.remove(+id);
      if (!result) {
        throw new HttpException('Panel not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Panel deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error deleting panel',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
