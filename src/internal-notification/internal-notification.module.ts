import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternalNotificationService } from './internal-notification.service';
import { InternalNotificationController } from './internal-notification.controller';
import { InternalNotification } from './entities/internal-notification.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([InternalNotification, User, Role])],
  controllers: [InternalNotificationController],
  providers: [InternalNotificationService, NotificationsGateway],
  exports: [InternalNotificationService, NotificationsGateway],
})
export class InternalNotificationModule {}
