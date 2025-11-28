import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHolderDto } from './dto/create-holder.dto';
import { UpdateHolderDto } from './dto/update-holder.dto';
import { Holder } from './entities/holder.entity';
import { TmpRepoBaseData } from 'src/csv-import/entities/tmp-repo-base-data.entity';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { PaginatedResponse } from '../shared/interfaces/paginated-response.interface';
import { User } from '../user/entities/user.entity';
import { CuitCuilUtils } from 'src/shared/validators/cuit-cuil.validator';

@Injectable()
export class HolderService {
  constructor(
    @InjectRepository(Holder)
    private holderRepo: Repository<Holder>,
    @InjectRepository(TmpRepoBaseData)
    private tmpRepoBaseData: Repository<TmpRepoBaseData>,
  ) {}

  async create(createHolderDto: CreateHolderDto): Promise<Holder> {
    const holderData: Partial<Holder> = {
      cuit: String(createHolderDto.cuit ?? ''),
    };

    if (createHolderDto.createdBy) {
      holderData.createdBy = { id: createHolderDto.createdBy } as User;
      holderData.updatedBy = { id: createHolderDto.createdBy } as User;
    }

    const holder = this.holderRepo.create(holderData);
    return await this.holderRepo.save(holder);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Holder>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.holderRepo.findAndCount({
      // relations: ['cidiData', 'cidiData.domicilio', 'cidiData.representado'],
      skip,
      take: limit,
    });

    return new PaginatedResponse(data, total, page, limit);
  }

  async findOne(id: number): Promise<Holder> {
    const holder = await this.holderRepo.findOne({
      where: { id },
      // relations: ['cidiData', 'cidiData.domicilio', 'cidiData.representado'],
    });
    if (!holder) {
      throw new NotFoundException(`Holder with ID ${id} not found`);
    }
    return holder;
  }

  async findByCuit(cuitParam: string): Promise<Holder> {
    if (!cuitParam) {
      throw new NotFoundException(`Holder with CUIT ${cuitParam} not found`);
    }

    const cuit = CuitCuilUtils.clean(cuitParam);
    if (!CuitCuilUtils.isValid(cuit)) {
      throw new NotFoundException(`Holder with CUIT ${cuitParam} not found`);
    }
    const holder = await this.holderRepo.findOne({
      where: { cuit },
      // relations: ['cidiData', 'cidiData.domicilio', 'cidiData.representado'],
    });

    if (!holder) {
      throw new NotFoundException(`Holder with CUIT ${cuit} not found`);
    }
    return holder;
  }

  async update(id: number, updateHolderDto: UpdateHolderDto): Promise<Holder> {
    const holder = await this.findOne(id);

    if (updateHolderDto.cuit !== undefined) {
      holder.cuit = String(updateHolderDto.cuit);
    }

    if (updateHolderDto.updatedBy) {
      holder.updatedBy = { id: updateHolderDto.updatedBy } as User;
    }

    return await this.holderRepo.save(holder);
  }

  async remove(id: number): Promise<void> {
    const holder = await this.findOne(id);
    await this.holderRepo.remove(holder);
  }

  async importHoldersFromFiles(): Promise<{ totalRows: number }> {
    const tmpHoldersRaw = await this.tmpRepoBaseData
      .createQueryBuilder('t')
      .select(['DISTINCT t.cuip as cuit'])
      .getRawMany();

    const holdersToSave = tmpHoldersRaw.map(this.mapRawDataToHolder);
    const savedHolders = await this.holderRepo.save(holdersToSave);

    return {
      totalRows: savedHolders.length,
    };
  }

  private mapRawDataToHolder = (raw: { CUIT?: string }): Partial<Holder> => {
    return {
      cuit: raw.CUIT ?? '',
    };
  };
}
