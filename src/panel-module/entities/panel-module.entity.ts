import { Panel } from '../../panel/entities/panel.entity';
import { User } from '../../user/entities/user.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('T_MODULOS_PANEL')
export class PanelModule {
  @ApiProperty({
    description: 'Unique panel module ID',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'ID_MODULOS_PANEL' })
  id: number;

  @ApiProperty({
    description: 'Panel module name',
    example: 'User Management',
  })
  @Column({ name: 'NOMBRE', nullable: false, length: 255 })
  name: string;

  @ApiProperty({
    description: 'Panel module description',
    example: 'Manage system users and their permissions',
    required: false,
  })
  @Column({ name: 'DESCRIPCION', nullable: true, length: 500 })
  description: string;

  @ApiProperty({
    description: 'Panel module icon',
    example: 'fas fa-users',
    required: false,
  })
  @Column({ name: 'ICONO', nullable: true, length: 255 })
  icon: string;

  @ApiProperty({
    description: 'Panel module link/route',
    example: '/users',
  })
  @Column({ name: 'LINK', nullable: true, length: 255 })
  link: string;

  @ApiProperty({
    description: 'Panel module active status (1 for active, 0 for inactive)',
    example: 1,
  })
  @Column({
    name: 'ACTIVO',
    type: 'number',
    width: 1,
    default: 1,
    nullable: false,
  })
  isActive: number;

  @ApiProperty({
    description: 'Associated panel',
    type: () => Panel,
  })
  @ManyToOne(() => Panel, panel => panel.panelModules, { nullable: false })
  @JoinColumn({ name: 'PANEL_ID' })
  panel: Panel;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Column({
    name: 'FEC_ALTA',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User who created this record',
    type: () => User,
    required: false,
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'USR_ALTA' })
  createdBy: User;

  @ApiProperty({
    description: 'Last modification date',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Column({
    name: 'FEC_MODIF',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User who last modified this record',
    type: () => User,
    required: false,
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'USR_MODIF' })
  updatedBy: User;

  @ApiProperty({
    description: 'Panel module active status as boolean',
    example: true,
  })
  get active(): boolean {
    return this.isActive === 1;
  }

  set active(value: boolean) {
    this.isActive = value ? 1 : 0;
  }
}
