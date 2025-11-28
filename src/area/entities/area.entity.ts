import { User } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('T_AREA')
export class Area {
  @ApiProperty({
    description: 'Unique area ID',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'ID_AREA' })
  id: number;

  @ApiProperty({
    description: 'Area name',
    example: 'Human Resources',
  })
  @Column({ name: 'NOMBRE', nullable: false, length: 255 })
  name: string;

  @ApiProperty({
    description: 'Area description',
    example: 'Manages employee relations and recruitment',
  })
  @Column({ name: 'DESCRIPCION', nullable: true, type: 'clob' })
  description: string;

  @ApiProperty({
    description: 'Area code',
    example: 'HR',
  })
  @Column({ name: 'CODIGO_AREA', nullable: false, length: 50, unique: true })
  codeArea: string;

  @ApiProperty({
    description: 'Area active status (1 for active, 0 for inactive)',
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
    description: 'Users in this area',
    type: () => [User],
  })
  @OneToMany(() => User, user => user.area)
  users: User[];

  @ApiProperty({
    description: 'Area active status as boolean',
    example: true,
  })
  get active(): boolean {
    return this.isActive === 1;
  }

  set active(value: boolean) {
    this.isActive = value ? 1 : 0;
  }
}
