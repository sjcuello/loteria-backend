import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';

@Entity('T_NOTIFICACIONES_INTERNAS')
export class InternalNotification {
  @ApiProperty({
    description: 'Unique notification ID',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'ID_NOTIFICACION' })
  id: number;

  @ApiProperty({
    description: 'Notification title',
    example: 'New message',
  })
  @Column({ name: 'TITULO', nullable: false, length: 255 })
  title: string;

  @ApiProperty({
    description: 'Notification message content',
    example: 'You have a new message from the administrator',
  })
  @Column({ name: 'MENSAJE', nullable: false, type: 'clob' })
  message: string;

  @ApiProperty({
    description: 'Notification type',
    example: 'info',
  })
  @Column({ name: 'TIPO', nullable: false, length: 50 })
  type: string;

  @ApiProperty({
    description: 'Whether the notification has been read',
    example: false,
  })
  @Column({ name: 'LEIDA', nullable: false, default: false })
  isRead: boolean;

  @ApiProperty({
    description: 'User who receives this notification',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'USUARIO_ID' })
  user: User;

  @ApiProperty({
    description: 'Role who receives this notification',
    type: () => Role,
  })
  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'ROL_ID' })
  role: Role;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ name: 'FEC_ALTA' })
  createdAt: Date;

  @ApiProperty({
    description: 'User who created this record',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'USR_ALTA' })
  createdBy: User;

  @ApiProperty({
    description: 'Last modification date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'FEC_MODIF' })
  updatedAt: Date;

  @ApiProperty({
    description: 'User who updated this record',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'USR_MODIF' })
  updatedBy: User;

  @ApiProperty({
    description: 'Whether the record is active or deleted',
    example: true,
  })
  @Column({ name: 'HABILITADO', nullable: false, default: true })
  enabled: boolean;
}
