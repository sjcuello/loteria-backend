import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { User } from './src/user/entities/user.entity';
import { Role } from './src/role/entities/role.entity';
import { Panel } from './src/panel/entities/panel.entity';
import { PanelModule } from './src/panel-module/entities/panel-module.entity';
import { Holder } from './src/holder/entities/holder.entity';

dotenv.config();

const configService = new ConfigService();

const entities = [Holder, Panel, PanelModule, Role, User];

export default new DataSource({
  type: 'oracle',
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  connectString: `${configService.get<string>('DB_HOST')}:${configService.get<string>('DB_PORT')}/${configService.get<string>('DB_SERVICE')}`,
  entities,
  migrations: ['./src/migrations/*.ts'],
  migrationsTableName: 'T_MIGRACIONES',
  logging: true,
  extra: {
    poolMin: 0,
    poolMax: 10,
    poolIncrement: 1,
  },
});
