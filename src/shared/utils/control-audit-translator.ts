/**
 * Utility for translating validation error messages to Spanish
 */
export class ValidationTranslatorAudit {
  private static readonly TRANSLATION_AUDIT_MAP: Record<string, string> = {
    account: 'cuentas',
    'account-detail': 'detalle de cuentas',
    category: 'rubros',
    'constant-value': 'constantes',
    'control-audit': 'control de auditoría',
    'csv-import': 'importación de CVS',
    ddjj: 'declaraciones juradas',
    'fee-formula': 'fórmula del cánon',
    'fee-formula-history': 'historial de fórmula del cánon',
    'fee-formula-parameter': 'parámetros de fórmula del cánon',
    holder: 'contribuyentes',
    panel: 'panel',
    'panel-module': 'submódulos',
    parameter: 'parámetros',
    'parameter-value': 'valores de parámetros',
    role: 'roles',
    simulation: 'simulaciones',
    subcategory: 'subrubros',
    'subcategory-formula': 'fórmula  de subrubro',
    usage: 'usos',
    'usage-admin': 'administrador de usos',
    user: 'usuarios',
    GET: 'obtener',
    POST: 'crear',
    PATCH: 'actualizar',
    PUT: 'agregar',
    DELETE: 'eliminar',
  };

  /**
   * Translates a single validation message to Spanish
   */
  static translateMessage(key: string): string {
    return this.TRANSLATION_AUDIT_MAP[key] ?? key;
  }
}
