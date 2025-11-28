import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { Visitor } from './entities/visitor.entity';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { PaginatedResponse } from '../shared/interfaces/paginated-response.interface';
import { User } from '../user/entities/user.entity';
import { CuitCuilUtils } from 'src/shared/validators/cuit-cuil.validator';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(Visitor)
    private visitorRepo: Repository<Visitor>,
  ) {}

  async create(createVisitorDto: CreateVisitorDto): Promise<Visitor> {
    const visitorData: Partial<Visitor> = {
      name: String(createVisitorDto.name),
      lastName: String(createVisitorDto.lastName),
      dni: String(createVisitorDto.dni),
      cuit: String(createVisitorDto.cuit ?? ''),
    };

    if (createVisitorDto.createdBy) {
      visitorData.createdBy = { id: createVisitorDto.createdBy } as User;
      visitorData.updatedBy = { id: createVisitorDto.createdBy } as User;
    }

    const visitor = this.visitorRepo.create(visitorData);
    return await this.visitorRepo.save(visitor);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Visitor>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.visitorRepo.findAndCount({
      skip,
      take: limit,
    });

    return new PaginatedResponse(data, total, page, limit);
  }

  async findOne(id: number): Promise<Visitor> {
    const visitor = await this.visitorRepo.findOne({
      where: { id },
    });
    if (!visitor) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }
    return visitor;
  }

  async findByCuit(cuitParam: string): Promise<Visitor> {
    if (!cuitParam) {
      throw new NotFoundException(`Visitor with CUIT ${cuitParam} not found`);
    }

    const cuit = CuitCuilUtils.clean(cuitParam);
    if (!CuitCuilUtils.isValid(cuit)) {
      throw new NotFoundException(`Visitor with CUIT ${cuitParam} not found`);
    }
    const visitor = await this.visitorRepo.findOne({
      where: { cuit },
    });

    if (!visitor) {
      throw new NotFoundException(`Visitor with CUIT ${cuit} not found`);
    }
    return visitor;
  }

  async update(
    id: number,
    updateVisitorDto: UpdateVisitorDto,
  ): Promise<Visitor> {
    const visitor = await this.findOne(id);

    if (updateVisitorDto.name !== undefined) {
      visitor.name = String(updateVisitorDto.name);
    }

    if (updateVisitorDto.lastName !== undefined) {
      visitor.lastName = String(updateVisitorDto.lastName);
    }

    if (updateVisitorDto.dni !== undefined) {
      visitor.dni = String(updateVisitorDto.dni);
    }

    if (updateVisitorDto.cuit !== undefined) {
      visitor.cuit = String(updateVisitorDto.cuit);
    }

    if (updateVisitorDto.updatedBy) {
      visitor.updatedBy = { id: updateVisitorDto.updatedBy } as User;
    }

    return await this.visitorRepo.save(visitor);
  }

  async remove(id: number): Promise<void> {
    const visitor = await this.findOne(id);
    await this.visitorRepo.remove(visitor);
  }

  private mapRawDataToVisitor = (raw: {
    NOMBRE?: string;
    APELLIDO?: string;
    DNI?: string;
    CUIT?: string;
  }): Partial<Visitor> => {
    return {
      name: raw.NOMBRE ?? '',
      lastName: raw.APELLIDO ?? '',
      dni: raw.DNI ?? '',
      cuit: raw.CUIT ?? '',
    };
  };
}
