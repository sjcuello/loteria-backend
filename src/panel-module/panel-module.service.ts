import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePanelModuleDto } from './dto/create-panel-module.dto';
import { UpdatePanelModuleDto } from './dto/update-panel-module.dto';
import { PanelModule } from './entities/panel-module.entity';
import { User } from '../user/entities/user.entity';
import { Panel } from '../panel/entities/panel.entity';

@Injectable()
export class PanelModuleService {
  constructor(
    @InjectRepository(PanelModule)
    private panelModuleRepository: Repository<PanelModule>,
  ) {}

  async create(createPanelModuleDto: CreatePanelModuleDto) {
    const panel = await this.panelModuleRepository.manager.findOne(Panel, {
      where: { id: createPanelModuleDto.panelId },
    });
    if (!panel) {
      throw new NotFoundException(
        `Panel with ID ${createPanelModuleDto.panelId} not found`,
      );
    }

    const panelModuleData: Partial<PanelModule> = {
      name: createPanelModuleDto.name,
      description: createPanelModuleDto.description,
      icon: createPanelModuleDto.icon,
      link: createPanelModuleDto.link,
      isActive: createPanelModuleDto.isActive ? 1 : 0,
      panel,
    };

    if (createPanelModuleDto.createdBy) {
      panelModuleData.createdBy = {
        id: createPanelModuleDto.createdBy,
      } as User;
      panelModuleData.updatedBy = {
        id: createPanelModuleDto.createdBy,
      } as User;
    }

    const panelModule = this.panelModuleRepository.create(panelModuleData);
    return this.panelModuleRepository.save(panelModule);
  }

  findAll() {
    return this.panelModuleRepository.find({
      relations: ['panel'],
    });
  }

  async findOne(id: number) {
    const panelModule = await this.panelModuleRepository.findOne({
      where: { id },
      relations: ['panel'],
    });

    if (!panelModule) {
      throw new NotFoundException(`PanelModule with ID ${id} not found`);
    }

    return panelModule;
  }

  async update(id: number, updatePanelModuleDto: UpdatePanelModuleDto) {
    const panelModule = await this.findOne(id);
    const { panelId, isActive, updatedBy, ...moduleData } =
      updatePanelModuleDto;

    if (panelId !== undefined) {
      const panel = await this.panelModuleRepository.manager.findOne(Panel, {
        where: { id: panelId },
      });
      if (!panel) {
        throw new NotFoundException(`Panel with ID ${panelId} not found`);
      }
      panelModule.panel = panel;
    }

    if (moduleData.name !== undefined) {
      panelModule.name = moduleData.name;
    }

    if (moduleData.description !== undefined) {
      panelModule.description = moduleData.description;
    }

    if (moduleData.icon !== undefined) {
      panelModule.icon = moduleData.icon;
    }

    if (moduleData.link !== undefined) {
      panelModule.link = moduleData.link;
    }

    if (isActive !== undefined) {
      panelModule.isActive = isActive ? 1 : 0;
    }

    if (updatedBy !== undefined) {
      panelModule.updatedBy = { id: updatedBy } as User;
    }

    return this.panelModuleRepository.save(panelModule);
  }

  async remove(id: number) {
    const panelModule = await this.findOne(id);

    await this.panelModuleRepository.delete(id);
    return panelModule;
  }
}
