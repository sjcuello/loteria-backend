import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../role/entities/role.entity';

@Entity('T_USUARIOS')
export class User {
  @ApiProperty({
    description: 'Unique user ID',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'ID_USUARIOS' })
  id: number;

  @ApiProperty({
    description: 'User CUIL/CUIT',
    example: '20-12345678-9',
    required: false,
  })
  @Column({
    name: 'CUIL',
    length: 255,
    unique: true,
  })
  cuil: string;

  @ApiProperty({
    description: 'User role',
    type: () => Role,
  })
  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'ROL_ID' })
  role: Role;

  @ApiProperty({
    description: 'User active status (1 for active, 0 for inactive)',
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
    description: 'User creation date',
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
    description: 'User active status as boolean',
    example: true,
  })
  get active(): boolean {
    return this.isActive === 1;
  }

  set active(value: boolean) {
    this.isActive = value ? 1 : 0;
  }
}
