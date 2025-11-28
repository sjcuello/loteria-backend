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
import { InternalNotificationService } from './internal-notification.service';
import { CreateInternalNotificationDto } from './dto/create-internal-notification.dto';
import { UpdateInternalNotificationDto } from './dto/update-internal-notification.dto';
import { InternalNotification } from './entities/internal-notification.entity';
import { ResponseMessage } from '../shared/interceptors/response-message.decorator';
import { BulkMarkNotificationsDto } from './dto/bulk-mark-notifications.dto';

@ApiTags('internal-notifications')
@Controller('internal-notification')
export class InternalNotificationController {
  constructor(
    private readonly internalNotificationService: InternalNotificationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new internal notification' })
  @ApiBody({ type: CreateInternalNotificationDto })
  @ApiResponse({
    status: 201,
    description: 'Internal notification created successfully',
    type: InternalNotification,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ResponseMessage('Notificación interna creada con éxito')
  create(@Body() createInternalNotificationDto: CreateInternalNotificationDto) {
    return this.internalNotificationService.create(
      createInternalNotificationDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all internal notifications' })
  @ApiResponse({
    status: 200,
    description: 'List of all internal notifications',
    type: [InternalNotification],
  })
  findAll() {
    return this.internalNotificationService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all notifications for a specific user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of notifications for the user',
    type: [InternalNotification],
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findByUser(@Param('userId') userId: string) {
    return this.internalNotificationService.findByUser(+userId);
  }

  @Get('user/:userId/unread')
  @ApiOperation({ summary: 'Get all unread notifications for a specific user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of unread notifications for the user',
    type: [InternalNotification],
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findUnreadByUser(@Param('userId') userId: string) {
    return this.internalNotificationService.findUnreadByUser(+userId);
  }

  @Get('role/:roleId')
  @ApiOperation({ summary: 'Get all notifications for a specific role' })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of notifications for the role',
    type: [InternalNotification],
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  findByRole(@Param('roleId') roleId: string) {
    return this.internalNotificationService.findByRole(+roleId);
  }

  @Get('role/:roleId/unread')
  @ApiOperation({ summary: 'Get all unread notifications for a specific role' })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of unread notifications for the role',
    type: [InternalNotification],
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  findUnreadByRole(@Param('roleId') roleId: string) {
    return this.internalNotificationService.findUnreadByRole(+roleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an internal notification by ID' })
  @ApiParam({
    name: 'id',
    description: 'Internal notification ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Internal notification found',
    type: InternalNotification,
  })
  @ApiResponse({
    status: 404,
    description: 'Internal notification not found',
  })
  findOne(@Param('id') id: string) {
    return this.internalNotificationService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an internal notification' })
  @ApiParam({
    name: 'id',
    description: 'Internal notification ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({ type: UpdateInternalNotificationDto })
  @ApiResponse({
    status: 200,
    description: 'Internal notification updated successfully',
    type: InternalNotification,
  })
  @ApiResponse({
    status: 404,
    description: 'Internal notification not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
  })
  @ResponseMessage('Notificación interna actualizada con éxito')
  update(
    @Param('id') id: string,
    @Body() updateInternalNotificationDto: UpdateInternalNotificationDto,
  ) {
    return this.internalNotificationService.update(
      +id,
      updateInternalNotificationDto,
    );
  }

  @Patch(':id/mark-as-read')
  @ApiOperation({ summary: 'Mark an internal notification as read' })
  @ApiParam({
    name: 'id',
    description: 'Internal notification ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Internal notification marked as read',
    type: InternalNotification,
  })
  @ApiResponse({
    status: 404,
    description: 'Internal notification not found',
  })
  @ResponseMessage('Notificación marcada como leída')
  markAsRead(@Param('id') id: string) {
    return this.internalNotificationService.markAsRead(+id);
  }

  @Patch('user/:userId/mark-all-as-read')
  @ApiOperation({
    summary: 'Mark all notifications as read for a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ResponseMessage('Todas las notificaciones marcadas como leídas')
  markAllAsReadByUser(@Param('userId') userId: string) {
    return this.internalNotificationService.markAllAsReadByUser(+userId);
  }

  @Patch('bulk/mark-read-status')
  @ApiOperation({
    summary: 'Mark multiple notifications as read/unread by IDs',
  })
  @ApiBody({ type: BulkMarkNotificationsDto })
  @ApiResponse({
    status: 200,
    description: 'Notifications marked as read/unread successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No notifications found with the provided IDs',
  })
  @ResponseMessage('Notificaciones marcadas como leídas/no leídas')
  updateManyReadStatus(
    @Body() bulkMarkNotificationsDto: BulkMarkNotificationsDto,
  ) {
    return this.internalNotificationService.updateManyReadStatus(
      bulkMarkNotificationsDto.notificationIds,
      bulkMarkNotificationsDto.isRead,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an internal notification' })
  @ApiParam({
    name: 'id',
    description: 'Internal notification ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Internal notification deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Internal notification not found',
  })
  @ResponseMessage('Notificación interna inhabilitada con éxito')
  remove(@Param('id') id: string) {
    return this.internalNotificationService.remove(+id);
  }
}
