import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateControlAuditDto } from './dto/create-control-audit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ControlAudit } from './entities/control-audit.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { PaginatedResponse } from '../shared/interfaces/paginated-response.interface';
import { PaginationControlAuditDto } from './dto/pagination-control-audit.dto';

@Injectable()
export class ControlAuditService {
  constructor(
    @InjectRepository(ControlAudit)
    private controlAuditRepository: Repository<ControlAudit>,
  ) {}

  async create(
    createControlAuditDto: CreateControlAuditDto,
  ): Promise<ControlAudit> {
    const controlAuditData: Partial<ControlAudit> = {
      moduleName: createControlAuditDto.moduleName,
      actionType: createControlAuditDto.actionType,
      description: createControlAuditDto.description,
      createdAt: createControlAuditDto.createdAt,
    };

    if (createControlAuditDto.isSuccessfully !== undefined) {
      controlAuditData.isSuccessfully = createControlAuditDto.isSuccessfully
        ? 1
        : 0;
    }

    if (createControlAuditDto.createdBy) {
      controlAuditData.createdBy = {
        id: createControlAuditDto.createdBy,
      } as User;
    }

    const controlAudit = this.controlAuditRepository.create(controlAuditData);

    return await this.controlAuditRepository.save(controlAudit);
  }

  async findAll(
    paginationDto: PaginationControlAuditDto,
  ): Promise<PaginatedResponse<ControlAudit>> {
    const {
      page = 1,
      limit = 10,
      filterByStatus,
      search = '',
      filterEndDate,
      filterStartDate,
    } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.controlAuditRepository
      .createQueryBuilder('controlAudit')
      .leftJoinAndSelect('controlAudit.createdBy', 'createdBy');

    if (filterByStatus !== undefined) {
      queryBuilder.where('controlAudit.isSuccessfully = :filterByStatus', {
        filterByStatus,
      });
    }

    if (search) {
      const searchValue = `%${search.toLowerCase()}%`;
      queryBuilder.andWhere(
        '(controlAudit.moduleName LIKE :module OR ' +
          'LOWER(createdBy.name) LIKE :username OR ' +
          'LOWER(createdBy.lastName) LIKE :userlastname OR ' +
          'LOWER(createdBy.cuil) LIKE :cuil)',
        {
          module: searchValue,
          username: searchValue,
          userlastname: searchValue,
          cuil: searchValue,
        },
      );
    }

    if (filterStartDate && filterEndDate) {
      queryBuilder.andWhere(
        'TRUNC(controlAudit.createdAt) BETWEEN TRUNC(:start) AND TRUNC(:end)',
        {
          start: filterStartDate,
          end: filterEndDate,
        },
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('controlAudit.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return new PaginatedResponse(data, total, page, limit);
  }

  async findOne(id: number): Promise<ControlAudit> {
    const controlAudit = await this.controlAuditRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!controlAudit) {
      throw new NotFoundException(`Audit control with ID ${id} not found`);
    }
    return controlAudit;
  }
}
