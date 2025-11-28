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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { PaginatedResponse } from '../shared/interfaces/paginated-response.interface';
import { ResponseMessage } from 'src/shared/interceptors/response-message.decorator';

@ApiTags('appointments')
@ApiBearerAuth()
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new appointment',
    description:
      'Creates a new visit appointment with visitor and user information',
  })
  @ApiBody({
    type: CreateAppointmentDto,
    description: 'Appointment data including visitor, user, dates, and reason',
  })
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully',
    type: Appointment,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Visita creada con éxito')
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all appointments with pagination',
    description: 'Returns a paginated list of all appointments',
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
    description: 'Paginated list of appointments',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Appointment' },
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
  ): Promise<PaginatedResponse<Appointment>> {
    return this.appointmentService.findAll(paginationDto);
  }

  @Get('visitor/:visitorId')
  @ApiOperation({
    summary: 'Get appointments by visitor',
    description: 'Returns all appointments for a specific visitor',
  })
  @ApiParam({
    name: 'visitorId',
    description: 'Visitor ID',
    type: 'number',
    example: 1,
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
    description: 'Paginated list of appointments for the visitor',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  findByVisitor(
    @Param('visitorId', ParseIntPipe) visitorId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Appointment>> {
    return this.appointmentService.findByVisitor(visitorId, paginationDto);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get appointments by user',
    description: 'Returns all appointments for a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'number',
    example: 1,
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
    description: 'Paginated list of appointments for the user',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Appointment>> {
    return this.appointmentService.findByUser(userId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an appointment by ID',
    description: 'Returns the information of a specific appointment by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment found',
    type: Appointment,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an appointment',
    description: 'Updates the information of an existing appointment',
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateAppointmentDto,
    description: 'Appointment data to update (all fields are optional)',
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment updated successfully',
    type: Appointment,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Visita actualizada con éxito')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Patch(':id/approve')
  @ApiOperation({
    summary: 'Approve an appointment',
    description: 'Marks an appointment as approved',
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        approvedById: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment approved successfully',
    type: Appointment,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Visita aprobada con éxito')
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Body('approvedById', ParseIntPipe) approvedById: number,
  ) {
    return this.appointmentService.approve(id, approvedById);
  }

  @Patch(':id/reject')
  @ApiOperation({
    summary: 'Reject an appointment',
    description: 'Marks an appointment as rejected',
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rejectedById: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment rejected successfully',
    type: Appointment,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Visita rechazada con éxito')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body('rejectedById', ParseIntPipe) rejectedById: number,
  ) {
    return this.appointmentService.reject(id, rejectedById);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an appointment',
    description: 'Deletes an appointment from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ResponseMessage('Visita eliminada con éxito')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.remove(id);
  }
}
