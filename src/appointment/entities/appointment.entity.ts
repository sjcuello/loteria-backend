import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Visitor } from '../../visitor/entities/visitor.entity';
import { AppointmentStatus } from '../enums/appointment-status.enum';

@Entity('T_VISITA')
export class Appointment {
  @ApiProperty({
    description: 'Unique appointment ID',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'ID_VISITA' })
  id: number;

  @ApiProperty({
    description: 'Visitor associated with this appointment',
    type: () => Visitor,
  })
  @ManyToOne(() => Visitor, { nullable: false })
  @JoinColumn({ name: 'VISITANTE_ID' })
  visitor: Visitor;

  @ApiProperty({
    description: 'Reason for the visit',
    example: 'Business meeting',
  })
  @Column({ name: 'MOTIVO', nullable: false, type: 'clob' })
  reason: string;

  @ApiProperty({
    description: 'User associated with this appointment',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'USER_ID' })
  user: User;

  @ApiProperty({
    description: 'Scheduled start date and time for the visit',
    example: '2024-01-15T10:00:00.000Z',
  })
  @Column({
    name: 'FECHA_INICIO',
    type: 'timestamp',
    nullable: false,
  })
  startDate: Date;

  @ApiProperty({
    description: 'Scheduled end date and time for the visit',
    example: '2024-01-15T12:00:00.000Z',
    required: false,
  })
  @Column({
    name: 'FECHA_FIN',
    type: 'timestamp',
    nullable: true,
  })
  endDate: Date;

  @ApiProperty({
    description: 'Indicates if the visit is instant (walk-in)',
    example: 0,
  })
  @Column({
    name: 'ES_INSTANTANEA',
    type: 'number',
    width: 1,
    default: 0,
    nullable: false,
  })
  isInstant: number;

  @ApiProperty({
    description: 'Actual start date and time when the visit began',
    example: '2024-01-15T10:05:00.000Z',
    required: false,
  })
  @Column({
    name: 'FECHA_INICIO_EFECTIVA',
    type: 'timestamp',
    nullable: true,
  })
  effectiveStartDate: Date;

  @ApiProperty({
    description: 'Actual end date and time when the visit ended',
    example: '2024-01-15T12:10:00.000Z',
    required: false,
  })
  @Column({
    name: 'FECHA_FIN_EFECTIVA',
    type: 'timestamp',
    nullable: true,
  })
  effectiveEndDate: Date;

  @ApiProperty({
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    example: AppointmentStatus.PENDIENTE,
  })
  @Column({
    name: 'ESTADO',
    type: 'varchar2',
    length: 50,
    default: AppointmentStatus.PENDIENTE,
    nullable: false,
  })
  status: AppointmentStatus;

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
    description: 'Instant visit status as boolean',
    example: false,
  })
  get instant(): boolean {
    return this.isInstant === 1;
  }

  set instant(value: boolean) {
    this.isInstant = value ? 1 : 0;
  }
}
