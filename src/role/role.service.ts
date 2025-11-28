import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Check if a role with the same name already exists (case-insensitive)
    const existingRole = await this.roleRepository
      .createQueryBuilder('role')
      .where('LOWER(role.name) = LOWER(:name)', { name: createRoleDto.name })
      .getOne();

    if (existingRole) {
      throw new ConflictException(
        `Role with name '${createRoleDto.name}' already exists`,
      );
    }

    const roleData: Partial<Role> = {
      name: createRoleDto.name,
      description: createRoleDto.description,
      isActive: createRoleDto.isActive ? 1 : 0,
    };

    if (createRoleDto.createdBy) {
      roleData.createdBy = { id: createRoleDto.createdBy } as User;
      roleData.updatedBy = { id: createRoleDto.createdBy } as User;
    }

    const role = this.roleRepository.create(roleData);
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (updateRoleDto.name !== undefined) {
      role.name = updateRoleDto.name;
    }

    if (updateRoleDto.description !== undefined) {
      role.description = updateRoleDto.description;
    }

    if (updateRoleDto.isActive !== undefined) {
      role.isActive = updateRoleDto.isActive ? 1 : 0;
    }

    if (updateRoleDto.updatedBy !== undefined) {
      role.updatedBy = { id: updateRoleDto.updatedBy } as User;
    }

    return await this.roleRepository.save(role);
  }

  async remove(id: number): Promise<{ message: string; statusCode: number }> {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    try {
      await this.roleRepository.update(role.id, { isActive: 0 });
      return {
        message: `Role with ID ${id} was successfully deactivated.`,
        statusCode: 200,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new ConflictException(
        `Role with ID '${id}' cannot be deleted: ${errorMessage}`,
      );
    }
  }

  async findActive(): Promise<Role[]> {
    return await this.roleRepository.find({ where: { isActive: 1 } });
  }
}
