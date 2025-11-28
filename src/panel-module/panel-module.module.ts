import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PanelModuleService } from './panel-module.service';
import { PanelModuleController } from './panel-module.controller';
import { PanelModule } from './entities/panel-module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PanelModule])],
  controllers: [PanelModuleController],
  providers: [PanelModuleService],
})
export class PanelModuleModule {}
