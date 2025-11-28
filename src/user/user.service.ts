import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { CuitCuilUtils } from '../shared/validators/cuit-cuil.validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .getMany();
  }

  async findAllActive(): Promise<User[]> {
    return await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.isActive = :isActive', { isActive: 1 })
      .getMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Find the role first
    const role = await this.roleRepo.findOne({
      where: { id: createUserDto.roleId },
    });

    if (!role) {
      throw new NotFoundException(
        `Role with ID ${createUserDto.roleId} not found`,
      );
    }

    const user = this.userRepo.create({
      name: createUserDto.name as string,
      lastName: createUserDto.lastName as string,
      dni: createUserDto.dni as string,
      cuil: createUserDto.cuil ?? '',
      role,
      isActive: createUserDto.isActive ? 1 : 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (createUserDto.createdById) {
      const createdByUser = await this.userRepo.findOne({
        where: { id: createUserDto.createdById },
      });
      if (createdByUser) {
        user.createdBy = createdByUser;
        user.updatedBy = createdByUser;
      }
    }

    return await this.userRepo.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.name !== undefined && updateUserDto.name !== null) {
      user.name = updateUserDto.name as string;
    }

    if (
      updateUserDto.lastName !== undefined &&
      updateUserDto.lastName !== null
    ) {
      user.lastName = updateUserDto.lastName as string;
    }

    if (updateUserDto.dni !== undefined && updateUserDto.dni !== null) {
      user.dni = updateUserDto.dni as string;
    }

    if (updateUserDto.cuil !== undefined && updateUserDto.cuil !== null) {
      user.cuil = updateUserDto.cuil;
    }

    if (updateUserDto.isActive !== undefined) {
      user.isActive = updateUserDto.isActive ? 1 : 0;
    }

    if (updateUserDto.roleId !== undefined) {
      const role = await this.roleRepo.findOne({
        where: { id: updateUserDto.roleId },
      });
      if (!role) {
        throw new NotFoundException(
          `Role with ID ${updateUserDto.roleId} not found`,
        );
      }
      user.role = role;
    }

    // Update modification audit fields
    user.updatedAt = new Date();
    if (updateUserDto.updatedById) {
      const updatedByUser = await this.userRepo.findOne({
        where: { id: updateUserDto.updatedById },
      });
      if (updatedByUser) {
        user.updatedBy = updatedByUser;
      }
    }

    return await this.userRepo.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
  }

  async findAllActiveByCuil(cuil: string): Promise<User | null> {
    if (!CuitCuilUtils.isValid(cuil)) {
      throw new BadRequestException('Invalid CUIT/CUIL format');
    }

    // Clean the CUIL for consistent database search (remove hyphens)
    const cleanCuil = CuitCuilUtils.clean(cuil);

    const userResponse = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.isActive = :isActive', { isActive: 1 })
      .andWhere("REPLACE(REPLACE(user.cuil, '-', ''), ' ', '') = :cuil", {
        cuil: cleanCuil,
      })
      .getOne();

    if (!userResponse) {
      throw new NotFoundException(`No active user found with CUIL ${cuil}`);
    }

    return userResponse;
  }

  async checkIsActiveByCuil(cuil: string): Promise<boolean> {
    if (!CuitCuilUtils.isValid(cuil)) {
      throw new BadRequestException('Invalid CUIT/CUIL format');
    }

    // Clean the CUIL for consistent database search (remove hyphens)
    const cleanCuil = CuitCuilUtils.clean(cuil);

    const userResponse = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.isActive = :isActive', { isActive: 1 })
      .andWhere("REPLACE(REPLACE(user.cuil, '-', ''), ' ', '') = :cuil", {
        cuil: cleanCuil,
      })
      .getOne();

    return Boolean(userResponse?.isActive) || false;
  }
}
