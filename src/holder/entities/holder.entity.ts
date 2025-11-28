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

@Entity('T_CONTRIBUYENTES')
export class Holder {
  @ApiProperty({
    description: 'Unique holder ID',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'ID_CONTRIBUYENTES' })
  id: number;

  @ApiProperty({
    description: 'Holder CUIT',
    example: '20-12345678-9',
  })
  @Column({ name: 'CUIT', nullable: false, unique: true, length: 255 })
  cuit: string;

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
