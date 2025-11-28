import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('T_AUDITORIA')
export class ControlAudit {
  @ApiProperty({
    description: 'Unique control audit ID',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'ID_AUDITORIA' })
  id: number;

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
    description: 'Operation description',
    example: 'Edit usage name',
    required: true,
  })
  @Column({ name: 'DESCRIPCION', nullable: true, length: 500 })
  description: string;

  @ApiProperty({
    description: 'Module name',
    example: 'Usage',
    required: true,
  })
  @Column({ name: 'NOMBRE_MODULO', nullable: true, length: 500 })
  moduleName: string;

  @ApiProperty({
    description: 'Action type',
    example: 'crear',
    required: true,
  })
  @Column({ name: 'TIPO_ACCION', nullable: true, length: 500 })
  actionType: string;

  @ApiProperty({
    description: 'Operation status (1 for success, 0 for failure)',
    example: 1,
  })
  @Column({
    name: 'ESTADO',
    type: 'number',
    width: 1,
    default: 1,
    nullable: false,
  })
  isSuccessfully: number;

  @ApiProperty({
    description: 'User who created this record',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'USR_ALTA' })
  createdBy: User;

  @ApiProperty({
    description: 'Operation status as boolean',
    example: true,
  })
  get active(): boolean {
    return this.isSuccessfully === 1;
  }

  set active(value: boolean) {
    this.isSuccessfully = value ? 1 : 0;
  }
}
