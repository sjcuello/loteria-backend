import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolderService } from './holder.service';
import { HolderController } from './holder.controller';
import { Holder } from './entities/holder.entity';
import { TmpRepoBaseData } from './../csv-import/entities/tmp-repo-base-data.entity';
import { CidiData } from '../cidi/entities/cidi-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Holder, TmpRepoBaseData, CidiData])],
  controllers: [HolderController],
  providers: [HolderService],
  exports: [HolderService],
})
export class HolderModule {}
