export interface RoleData {
  id: number;
  name: string;
  isActive: number;
}

export interface PanelData {
  id: number;
  name: string;
  isActive: number;
  roleId: number;
}

export interface PanelModuleData {
  id: number;
  name: string;
  description: string;
  panelId: number;
}

export interface JsonData {
  role?: RoleData[];
  panel?: PanelData[];
  panel_module?: PanelModuleData[];
}

export interface SeedConfig<T> {
  tableName: string;
  fileName: string;
  dataKey: keyof JsonData;
  emoji: string;
  displayName: string;
  insertQuery: string;
  mapToParams: (item: T) => any[];
  skipExistingCheck?: boolean;
}
