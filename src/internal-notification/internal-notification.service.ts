import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInternalNotificationDto } from './dto/create-internal-notification.dto';
import { UpdateInternalNotificationDto } from './dto/update-internal-notification.dto';
import { InternalNotification } from './entities/internal-notification.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class InternalNotificationService {
  constructor(
    @InjectRepository(InternalNotification)
    private internalNotificationRepository: Repository<InternalNotification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(
    createInternalNotificationDto: CreateInternalNotificationDto,
  ): Promise<InternalNotification> {
    try {
      if (
        !createInternalNotificationDto.userId &&
        !createInternalNotificationDto.roleId
      ) {
        throw new BadRequestException('Se debe proporcionar userId o roleId');
      }

      if (
        createInternalNotificationDto.userId &&
        createInternalNotificationDto.roleId
      ) {
        throw new BadRequestException(
          'No se puede proporcionar userId y roleId al mismo tiempo',
        );
      }

      const notificationData: Partial<InternalNotification> = {
        title: createInternalNotificationDto.title,
        message: createInternalNotificationDto.message,
        type: createInternalNotificationDto.type,
        isRead: createInternalNotificationDto.isRead ?? false,
      };

      // Handle user-specific notification
      if (createInternalNotificationDto.userId) {
        const user = await this.userRepository.findOne({
          where: { id: createInternalNotificationDto.userId },
        });
        if (!user) {
          throw new NotFoundException(
            `El usuario con ID ${createInternalNotificationDto.userId} no fue encontrado`,
          );
        }
        notificationData.user = user;
      }

      if (createInternalNotificationDto.roleId) {
        const role = await this.roleRepository.findOne({
          where: { id: createInternalNotificationDto.roleId },
        });
        if (!role) {
          throw new NotFoundException(
            `El rol con ID ${createInternalNotificationDto.roleId} no fue encontrado`,
          );
        }
        notificationData.role = role;
      }

      if (createInternalNotificationDto.createdBy) {
        notificationData.createdBy = {
          id: createInternalNotificationDto.createdBy,
        } as User;
        notificationData.updatedBy = {
          id: createInternalNotificationDto.createdBy,
        } as User;
      }

      const notification =
        this.internalNotificationRepository.create(notificationData);

      const savedNotification =
        await this.internalNotificationRepository.save(notification);

      // Emit real-time notification
      if (savedNotification.user) {
        this.notificationsGateway.emitNotificationToUser(
          savedNotification.user.id,
          savedNotification,
        );
      } else if (savedNotification.role) {
        this.notificationsGateway.emitNotificationToRole(
          savedNotification.role.id,
          savedNotification,
        );
      }

      return savedNotification;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al crear la notificación interna',
        error as Error,
      );
    }
  }

  async findAll(): Promise<InternalNotification[]> {
    try {
      return await this.internalNotificationRepository.find({
        where: { enabled: true },
        relations: ['user', 'role', 'createdBy', 'updatedBy'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener las notificaciones internas',
        error as Error,
      );
    }
  }

  async findOne(id: number): Promise<InternalNotification> {
    try {
      const notification = await this.internalNotificationRepository.findOne({
        where: { id, enabled: true },
        relations: ['user', 'role', 'createdBy', 'updatedBy'],
      });

      if (!notification) {
        throw new NotFoundException(
          `La notificación interna con ID ${id} no fue encontrada`,
        );
      }

      return notification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al obtener la notificación interna con ID ${id}`,
        error as Error,
      );
    }
  }

  async findByUser(userId: number): Promise<InternalNotification[]> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(
          `El usuario con ID ${userId} no fue encontrado`,
        );
      }

      return await this.internalNotificationRepository.find({
        where: { user: { id: userId }, enabled: true },
        relations: ['user', 'role', 'createdBy', 'updatedBy'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al obtener las notificaciones del usuario con ID ${userId}`,
        error as Error,
      );
    }
  }

  async findUnreadByUser(userId: number): Promise<InternalNotification[]> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(
          `El usuario con ID ${userId} no fue encontrado`,
        );
      }

      return await this.internalNotificationRepository.find({
        where: { user: { id: userId }, isRead: false, enabled: true },
        relations: ['user', 'role', 'createdBy', 'updatedBy'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al obtener las notificaciones no leídas del usuario con ID ${userId}`,
        error as Error,
      );
    }
  }

  async findByRole(roleId: number): Promise<InternalNotification[]> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id: roleId },
      });
      if (!role) {
        throw new NotFoundException(
          `El rol con ID ${roleId} no fue encontrado`,
        );
      }

      return await this.internalNotificationRepository.find({
        where: { role: { id: roleId }, enabled: true },
        relations: ['user', 'role', 'createdBy', 'updatedBy'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al obtener las notificaciones del rol con ID ${roleId}`,
        error as Error,
      );
    }
  }

  async findUnreadByRole(roleId: number): Promise<InternalNotification[]> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id: roleId },
      });
      if (!role) {
        throw new NotFoundException(
          `El rol con ID ${roleId} no fue encontrado`,
        );
      }

      return await this.internalNotificationRepository.find({
        where: { role: { id: roleId }, isRead: false, enabled: true },
        relations: ['user', 'role', 'createdBy', 'updatedBy'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al obtener las notificaciones no leídas del rol con ID ${roleId}`,
        error as Error,
      );
    }
  }

  async markAsRead(id: number): Promise<InternalNotification> {
    try {
      const notification = await this.findOne(id);

      notification.isRead = true;
      const updatedNotification =
        await this.internalNotificationRepository.save(notification);

      if (updatedNotification.user) {
        this.notificationsGateway.emitNotificationUpdate(
          updatedNotification.user.id,
          updatedNotification,
        );
      } else if (updatedNotification.role) {
        this.notificationsGateway.emitNotificationUpdateToRole(
          updatedNotification.role.id,
          updatedNotification,
        );
      }

      return updatedNotification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al marcar como leída la notificación con ID ${id}`,
        error as Error,
      );
    }
  }

  async markAllAsReadByUser(userId: number): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(
          `El usuario con ID ${userId} no fue encontrado`,
        );
      }

      await this.internalNotificationRepository.update(
        { user: { id: userId }, isRead: false, enabled: true },
        { isRead: true },
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al marcar todas las notificaciones como leídas para el usuario con ID ${userId}`,
        error as Error,
      );
    }
  }

  async updateManyReadStatus(
    notificationIds: number[],
    isRead: boolean,
  ): Promise<void> {
    if (notificationIds.length === 0) return;

    try {
      // Get affected notifications to emit events per user
      const notifications = await this.internalNotificationRepository.find({
        where: notificationIds.map(id => ({ id, enabled: true })),
        relations: ['user', 'role'],
      });

      await this.internalNotificationRepository
        .createQueryBuilder()
        .update(InternalNotification)
        .set({ isRead })
        .where('id IN (:...ids)', { ids: notificationIds })
        .andWhere('enabled = :enabled', { enabled: true })
        .execute();

      const userNotifications = new Map<number, number[]>();
      const roleNotifications = new Map<number, number[]>();

      notifications.forEach(notification => {
        if (notification.user) {
          const userId = notification.user.id;
          if (!userNotifications.has(userId)) {
            userNotifications.set(userId, []);
          }
          userNotifications.get(userId)!.push(notification.id);
        } else if (notification.role) {
          const roleId = notification.role.id;
          if (!roleNotifications.has(roleId)) {
            roleNotifications.set(roleId, []);
          }
          roleNotifications.get(roleId)!.push(notification.id);
        }
      });

      userNotifications.forEach((ids, userId) => {
        this.notificationsGateway.emitBulkStatusChange(userId, ids, isRead);
      });

      roleNotifications.forEach((ids, roleId) => {
        this.notificationsGateway.emitBulkStatusChangeToRole(
          roleId,
          ids,
          isRead,
        );
      });
    } catch (error) {
      const action = isRead ? 'leídas' : 'no leídas';
      throw new InternalServerErrorException(
        `Error al marcar las notificaciones como ${action}`,
        error as Error,
      );
    }
  }

  async update(
    id: number,
    updateInternalNotificationDto: UpdateInternalNotificationDto,
  ): Promise<InternalNotification> {
    try {
      const notification = await this.findOne(id);

      if (
        updateInternalNotificationDto.userId !== undefined &&
        updateInternalNotificationDto.roleId !== undefined
      ) {
        throw new BadRequestException(
          'No se puede proporcionar userId y roleId al mismo tiempo',
        );
      }

      if (
        updateInternalNotificationDto.userId !== undefined &&
        updateInternalNotificationDto.userId !== notification.user?.id
      ) {
        const user = updateInternalNotificationDto.userId
          ? await this.userRepository.findOne({
              where: { id: updateInternalNotificationDto.userId },
            })
          : null;

        if (updateInternalNotificationDto.userId && !user) {
          throw new NotFoundException(
            `El usuario con ID ${updateInternalNotificationDto.userId} no fue encontrado`,
          );
        }
        Object.assign(notification, { user });
      }

      if (
        updateInternalNotificationDto.roleId !== undefined &&
        updateInternalNotificationDto.roleId !== notification.role?.id
      ) {
        const role = updateInternalNotificationDto.roleId
          ? await this.roleRepository.findOne({
              where: { id: updateInternalNotificationDto.roleId },
            })
          : null;

        if (updateInternalNotificationDto.roleId && !role) {
          throw new NotFoundException(
            `El rol con ID ${updateInternalNotificationDto.roleId} no fue encontrado`,
          );
        }

        Object.assign(notification, { role });
      }

      if (updateInternalNotificationDto.title !== undefined) {
        notification.title = updateInternalNotificationDto.title;
      }
      if (updateInternalNotificationDto.message !== undefined) {
        notification.message = updateInternalNotificationDto.message;
      }
      if (updateInternalNotificationDto.type !== undefined) {
        notification.type = updateInternalNotificationDto.type;
      }
      if (updateInternalNotificationDto.isRead !== undefined) {
        notification.isRead = updateInternalNotificationDto.isRead;
      }

      if (updateInternalNotificationDto.updatedBy) {
        notification.updatedBy = {
          id: updateInternalNotificationDto.updatedBy,
        } as User;
      }

      return await this.internalNotificationRepository.save(notification);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al actualizar la notificación interna con ID ${id}`,
        error as Error,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const notification = await this.findOne(id);

      notification.enabled = false;
      await this.internalNotificationRepository.save(notification);

      if (notification.user) {
        this.notificationsGateway.emitNotificationDeleted(
          notification.user.id,
          id,
        );
      } else if (notification.role) {
        this.notificationsGateway.emitNotificationDeletedToRole(
          notification.role.id,
          id,
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al inhabilitar la notificación interna con ID ${id}`,
        error as Error,
      );
    }
  }
}
