import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PanelModuleService } from './panel-module.service';
import { CreatePanelModuleDto } from './dto/create-panel-module.dto';
import { UpdatePanelModuleDto } from './dto/update-panel-module.dto';
import { PanelModule } from './entities/panel-module.entity';
import { ResponseMessage } from 'src/shared/interceptors/response-message.decorator';

@ApiTags('panel-modules')
@Controller('panel-module')
export class PanelModuleController {
  constructor(private readonly panelModuleService: PanelModuleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new panel module' })
  @ApiBody({ type: CreatePanelModuleDto })
  @ApiResponse({
    status: 201,
    description: 'Panel module created successfully',
    type: PanelModule,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ResponseMessage('Submódulo creado con éxito')
  create(@Body() createPanelModuleDto: CreatePanelModuleDto) {
    return this.panelModuleService.create(createPanelModuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all panel modules' })
  @ApiResponse({
    status: 200,
    description: 'List of all panel modules',
    type: [PanelModule],
  })
  findAll() {
    return this.panelModuleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a panel module by ID' })
  @ApiParam({
    name: 'id',
    description: 'Panel module ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Panel module found',
    type: PanelModule,
  })
  @ApiResponse({
    status: 404,
    description: 'Panel module not found',
  })
  findOne(@Param('id') id: string) {
    return this.panelModuleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a panel module' })
  @ApiParam({
    name: 'id',
    description: 'Panel module ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({ type: UpdatePanelModuleDto })
  @ApiResponse({
    status: 200,
    description: 'Panel module updated successfully',
    type: PanelModule,
  })
  @ApiResponse({
    status: 404,
    description: 'Panel module not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ResponseMessage('Submódulo actualizado con éxito')
  update(
    @Param('id') id: string,
    @Body() updatePanelModuleDto: UpdatePanelModuleDto,
  ) {
    return this.panelModuleService.update(+id, updatePanelModuleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a panel module' })
  @ApiParam({
    name: 'id',
    description: 'Panel module ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Panel module deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Panel module not found',
  })
  @ResponseMessage('Submódulo inhabilitado con éxito')
  remove(@Param('id') id: string) {
    return this.panelModuleService.remove(+id);
  }
}
