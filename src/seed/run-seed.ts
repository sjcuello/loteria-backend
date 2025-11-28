/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import {
  AreaData,
  JsonData,
  PanelData,
  PanelModuleData,
  SeedConfig,
} from './interfaces';
import { resetSequences } from './reset-sequences';

export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  private convertToOracleDate(isoDateString: string): Date {
    try {
      const date = new Date(isoDateString);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date string: ${isoDateString}`);
      }
      return date;
    } catch {
      console.warn(
        `Warning: Could not parse date ${isoDateString}, using current date`,
      );
      return new Date();
    }
  }

  private async genericSeed<T>(config: SeedConfig<T>): Promise<void> {
    console.log(`${config.emoji} Seeding ${config.displayName}...`);

    if (!config.skipExistingCheck) {
      const existingData = await this.dataSource.query(
        `SELECT count(*) as count FROM "${config.tableName}"`,
      );

      if (existingData[0].COUNT > 0) {
        console.log(
          `ℹ️ ${config.displayName} already exist, skipping ${config.displayName.toLowerCase()} seeding`,
        );
        return;
      }
    }

    const data = this.readJsonFile<JsonData>(config.fileName);
    const items = data[config.dataKey] as T[];

    if (items && items.length > 0) {
      for (const item of items) {
        const params = config.mapToParams(item);
        await this.dataSource.query(config.insertQuery, params);
      }
      console.log(
        `✅ Inserted ${items.length} ${config.displayName.toLowerCase()}`,
      );
    }
  }

  async seed(): Promise<void> {
    console.log('🌱 Starting database seeding...');

    try {
      // Seed in order of dependencies
      await this.seedAreas();
      await this.seedPanels();
      await this.seedPanelModules();
      // Reset sequences after seeding to prevent ID conflicts
      await resetSequences(this.dataSource);
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    }
  }

  private async seedPanels(): Promise<void> {
    await this.genericSeed<PanelData>({
      tableName: 'T_PANELES',
      fileName: '_panel__202508251609.json',
      dataKey: 'panel',
      emoji: '🖥️',
      displayName: 'panels',
      insertQuery: `INSERT INTO "T_PANELES" ("ID_PANELES", "NOMBRE", "ACTIVO", "ROL_ID") VALUES (:1, :2, :3, :4)`,
      mapToParams: (panel: PanelData): (string | number | Date | null)[] => [
        panel.id,
        panel.name,
        panel.isActive,
        panel.roleId,
      ],
    });
  }

  private async seedAreas(): Promise<void> {
    await this.genericSeed<AreaData>({
      tableName: 'T_AREA',
      fileName: '_area__202508251609.json',
      dataKey: 'area',
      emoji: '📁',
      displayName: 'areas',
      insertQuery: `INSERT INTO "T_AREA" ("ID_AREA", "NOMBRE", "DESCRIPCION", "CODIGO_AREA", "ACTIVO") VALUES (:1, :2, :3, :4, :5)`,
      mapToParams: (area: AreaData): (string | number | Date | null)[] => [
        area.id,
        area.name,
        area.description || null,
        area.codeArea,
        area.isActive ?? 1,
      ],
    });
  }

  private async seedPanelModules(): Promise<void> {
    await this.genericSeed<PanelModuleData>({
      tableName: 'T_MODULOS_PANEL',
      fileName: '_panel_module__202508251609.json',
      dataKey: 'panel_module',
      emoji: '🔧',
      displayName: 'panel modules',
      insertQuery: `INSERT INTO "T_MODULOS_PANEL" ("ID_MODULOS_PANEL", "NOMBRE", "DESCRIPCION", "PANEL_ID") VALUES (:1, :2, :3, :4)`,
      mapToParams: (
        module: PanelModuleData,
      ): (string | number | Date | null)[] => [
        module.id,
        module.name,
        module.description,
        module.panelId,
      ],
      skipExistingCheck: true, // Panel modules don't have existing check in original
    });
  }

  private readJsonFile<T>(filename: string): T {
    try {
      const filePath = path.join(__dirname, 'files', filename);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent) as T;
      }
      return {} as T;
    } catch (error) {
      console.warn(
        `⚠️ Warning: Could not read file ${filename}:`,
        (error as Error).message,
      );
      return {} as T;
    }
  }
}

export async function runSeeder(dataSource: DataSource): Promise<void> {
  const seeder = new DatabaseSeeder(dataSource);
  await seeder.seed();
}
