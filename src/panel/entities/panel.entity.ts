import { Role } from '../../role/entities/role.entity';
import { User } from '../../user/entities/user.entity';
import { PanelModule } from '../../panel-module/entities/panel-module.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('T_PANELES')
export class Panel {
  @ApiProperty({
    description: 'Unique panel ID',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'ID_PANELES' })
  id: number;

  @ApiProperty({
    description: 'Panel name',
    example: 'Admin Panel',
  })
  @Column({ name: 'NOMBRE', nullable: false, length: 255 })
  name: string;

  @ApiProperty({
    description: 'Panel active status (1 for active, 0 for inactive)',
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
    description: 'Associated role',
    type: () => Role,
  })
  @ManyToOne(() => Role, role => role.panels, { nullable: false })
  @JoinColumn({ name: 'ROL_ID' })
  role: Role;

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
    description: 'Panel modules',
    type: () => [PanelModule],
  })
  @OneToMany(() => PanelModule, panelModule => panelModule.panel)
  panelModules: PanelModule[];

  @ApiProperty({
    description: 'Panel active status as boolean',
    example: true,
  })
  get active(): boolean {
    return this.isActive === 1;
  }

  set active(value: boolean) {
    this.isActive = value ? 1 : 0;
  }
}
