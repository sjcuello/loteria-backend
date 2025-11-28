import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PanelService } from './panel.service';
import { PanelController } from './panel.controller';
import { Panel } from './entities/panel.entity';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Panel, Role])],
  controllers: [PanelController],
  providers: [PanelService],
})
export class PanelModule {}
