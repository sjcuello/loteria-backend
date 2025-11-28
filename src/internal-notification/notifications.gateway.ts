import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets: Map<number, Set<string>> = new Map();
  private roleSockets: Map<number, Set<string>> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Remove client from all user rooms
    this.userSockets.forEach((sockets, userId) => {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
        this.logger.log(`Removed client ${client.id} from user ${userId}`);
      }
    });

    // Remove client from all role rooms
    this.roleSockets.forEach((sockets, roleId) => {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.roleSockets.delete(roleId);
        }
        this.logger.log(`Removed client ${client.id} from role ${roleId}`);
      }
    });
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() data: { userId?: number; roleId?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, roleId } = data;

    if (!userId && !roleId) {
      return { error: 'User ID or Role ID is required' };
    }

    // Add client to user's socket set
    if (userId) {
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      // Join user-specific room
      void client.join(`user:${userId}`);

      this.logger.log(`Client ${client.id} registered for user ${userId}`);
    }

    // Add client to role's socket set
    if (roleId) {
      if (!this.roleSockets.has(roleId)) {
        this.roleSockets.set(roleId, new Set());
      }
      this.roleSockets.get(roleId)!.add(client.id);

      // Join role-specific room
      void client.join(`role:${roleId}`);

      this.logger.log(`Client ${client.id} registered for role ${roleId}`);
    }

    return { success: true, message: 'Registered for notifications' };
  }

  @SubscribeMessage('unregister')
  handleUnregister(
    @MessageBody() data: { userId?: number; roleId?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, roleId } = data;

    if (userId && this.userSockets.has(userId)) {
      const sockets = this.userSockets.get(userId)!;
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
      void client.leave(`user:${userId}`);
      this.logger.log(`Client ${client.id} unregistered from user ${userId}`);
    }

    if (roleId && this.roleSockets.has(roleId)) {
      const sockets = this.roleSockets.get(roleId)!;
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.roleSockets.delete(roleId);
      }
      void client.leave(`role:${roleId}`);
      this.logger.log(`Client ${client.id} unregistered from role ${roleId}`);
    }

    return { success: true, message: 'Unregistered from notifications' };
  }

  // Emit new notification to specific user
  emitNotificationToUser(userId: number, notification: any) {
    this.server.to(`user:${userId}`).emit('newNotification', notification);
    this.logger.log(`Emitted notification to user ${userId}`);
  }

  // Emit notification update to specific user
  emitNotificationUpdate(userId: number, notification: any) {
    this.server.to(`user:${userId}`).emit('notificationUpdate', notification);
    this.logger.log(`Emitted notification update to user ${userId}`);
  }

  // Emit notification deletion to specific user
  emitNotificationDeleted(userId: number, notificationId: number) {
    this.server
      .to(`user:${userId}`)
      .emit('notificationDeleted', { id: notificationId });
    this.logger.log(`Emitted notification deletion to user ${userId}`);
  }

  // Emit bulk status change to specific user
  emitBulkStatusChange(
    userId: number,
    notificationIds: number[],
    isRead: boolean,
  ) {
    this.server
      .to(`user:${userId}`)
      .emit('bulkStatusChange', { notificationIds, isRead });
    this.logger.log(
      `Emitted bulk status change to user ${userId}: ${notificationIds.length} notifications`,
    );
  }

  // Emit new notification to role
  emitNotificationToRole(roleId: number, notification: any) {
    this.server.to(`role:${roleId}`).emit('newNotification', notification);
    this.logger.log(`Emitted notification to role ${roleId}`);
  }

  // Emit notification update to role
  emitNotificationUpdateToRole(roleId: number, notification: any) {
    this.server.to(`role:${roleId}`).emit('notificationUpdate', notification);
    this.logger.log(`Emitted notification update to role ${roleId}`);
  }

  // Emit notification deletion to role
  emitNotificationDeletedToRole(roleId: number, notificationId: number) {
    this.server
      .to(`role:${roleId}`)
      .emit('notificationDeleted', { id: notificationId });
    this.logger.log(`Emitted notification deletion to role ${roleId}`);
  }

  // Emit bulk status change to role
  emitBulkStatusChangeToRole(
    roleId: number,
    notificationIds: number[],
    isRead: boolean,
  ) {
    this.server
      .to(`role:${roleId}`)
      .emit('bulkStatusChange', { notificationIds, isRead });
    this.logger.log(
      `Emitted bulk status change to role ${roleId}: ${notificationIds.length} notifications`,
    );
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  // Get connected roles count
  getConnectedRolesCount(): number {
    return this.roleSockets.size;
  }

  // Check if user is connected
  isUserConnected(userId: number): boolean {
    return (
      this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0
    );
  }

  // Check if role is connected
  isRoleConnected(roleId: number): boolean {
    return (
      this.roleSockets.has(roleId) && this.roleSockets.get(roleId)!.size > 0
    );
  }
}
