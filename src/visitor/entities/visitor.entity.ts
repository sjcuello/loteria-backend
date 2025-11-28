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

@Entity('T_VISITANTES')
export class Visitor {
  @ApiProperty({
    description: 'Unique visitor ID',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'ID_VISITANTE' })
  id: number;

  @ApiProperty({
    description: 'Visitor NAME',
    example: 'John',
  })
  @Column({ name: 'NOMBRE', nullable: false, length: 255 })
  name: string;

  @ApiProperty({
    description: 'Visitor LAST NAME',
    example: 'Doe',
  })
  @Column({ name: 'APELLIDO', nullable: false, length: 255 })
  lastName: string;

  @ApiProperty({
    description: 'Visitor DNI',
    example: '12345678',
  })
  @Column({ name: 'DNI', nullable: false, unique: true, length: 255 })
  dni: string;

  @ApiProperty({
    description: 'Visitor CUIT',
    example: '20-12345678-9',
  })
  @Column({ name: 'CUIT', nullable: false, length: 255 })
  cuit: string;

  @ApiProperty({
    description: 'Visitor EMAIL',
    example: 'john.doe@example.com',
  })
  @Column({ name: 'EMAIL', nullable: false, length: 255 })
  email: string;

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
    description: 'User who last modified this record',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'USR_MODIF' })
  updatedBy: User;
}
