import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { Panel } from './entities/panel.entity';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PanelService {
  constructor(
    @InjectRepository(Panel)
    private panelRepository: Repository<Panel>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createPanelDto: CreatePanelDto): Promise<Panel> {
    // Find the role first
    const role = await this.roleRepository.findOne({
      where: { id: createPanelDto.roleId },
    });
    if (!role) {
      throw new Error('Role not found');
    }

    const panelData: Partial<Panel> = {
      name: createPanelDto.name,
      role,
      isActive: createPanelDto.isActive ? 1 : 0,
    };

    if (createPanelDto.createdBy) {
      panelData.createdBy = { id: createPanelDto.createdBy } as User;
      panelData.updatedBy = { id: createPanelDto.createdBy } as User;
    }

    const panel = this.panelRepository.create(panelData);
    return this.panelRepository.save(panel);
  }

  async findAll(): Promise<Panel[]> {
    return this.panelRepository.find({
      relations: ['role'],
    });
  }

  async findOne(id: number): Promise<Panel | null> {
    return this.panelRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async update(
    id: number,
    updatePanelDto: UpdatePanelDto,
  ): Promise<Panel | null> {
    const panel = await this.findOne(id);
    if (!panel) {
      return null;
    }

    if (updatePanelDto.roleId) {
      const role = await this.roleRepository.findOne({
        where: { id: updatePanelDto.roleId },
      });
      if (!role) {
        throw new Error('Role not found');
      }
      panel.role = role;
    }

    if (updatePanelDto.name !== undefined) {
      panel.name = updatePanelDto.name;
    }

    if (updatePanelDto.isActive !== undefined) {
      panel.isActive = updatePanelDto.isActive ? 1 : 0;
    }

    if (updatePanelDto.updatedBy !== undefined) {
      panel.updatedBy = { id: updatePanelDto.updatedBy } as User;
    }

    return this.panelRepository.save(panel);
  }

  async remove(id: number): Promise<Panel | null> {
    const panel = await this.findOne(id);
    if (!panel) {
      return null;
    }
    await this.panelRepository.remove(panel);
    return panel;
  }
}
