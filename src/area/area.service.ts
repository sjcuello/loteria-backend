import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private areaRepository: Repository<Area>,
  ) {}

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    const areaData: Partial<Area> = {
      name: createAreaDto.name,
      description: createAreaDto.description,
      codeArea: createAreaDto.codeArea,
      isActive: createAreaDto.isActive ? 1 : 0,
    };

    if (createAreaDto.createdBy) {
      areaData.createdBy = { id: createAreaDto.createdBy } as User;
      areaData.updatedBy = { id: createAreaDto.createdBy } as User;
    }

    const area = this.areaRepository.create(areaData);
    return this.areaRepository.save(area);
  }

  async findAll(): Promise<Area[]> {
    return this.areaRepository.find();
  }

  async findOne(id: number): Promise<Area | null> {
    return this.areaRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateAreaDto: UpdateAreaDto): Promise<Area | null> {
    const area = await this.findOne(id);
    if (!area) {
      return null;
    }

    if (updateAreaDto.name !== undefined) {
      area.name = updateAreaDto.name;
    }

    if (updateAreaDto.description !== undefined) {
      area.description = updateAreaDto.description;
    }

    if (updateAreaDto.codeArea !== undefined) {
      area.codeArea = updateAreaDto.codeArea;
    }

    if (updateAreaDto.isActive !== undefined) {
      area.isActive = updateAreaDto.isActive ? 1 : 0;
    }

    if (updateAreaDto.updatedBy !== undefined) {
      area.updatedBy = { id: updateAreaDto.updatedBy } as User;
    }

    return this.areaRepository.save(area);
  }

  async remove(id: number): Promise<Area | null> {
    const area = await this.findOne(id);
    if (!area) {
      return null;
    }
    await this.areaRepository.remove(area);
    return area;
  }
}
