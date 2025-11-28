import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ValidationTranslatorAudit } from './control-audit-translator';
import { CreateControlAuditDto } from '../../control-audit/dto/create-control-audit.dto';

/**
 * Utility to create audit-control data
 */
export class CreateControlAuditData {
  /**
   * Translates a single validation message to Spanish
   */
  static create(
    isError: boolean,
    module: string,
    ctx: HttpArgumentsHost,
    id = '',
  ): CreateControlAuditDto {
    const request = ctx.getRequest<{
      headers: Record<string, any>;
      url: string;
      method: string;
    }>();

    const moduleName: string =
      ValidationTranslatorAudit.translateMessage(module);

    const userId: number = Number(request.headers['custom-data']);
    const actionType: string = ValidationTranslatorAudit.translateMessage(
      request.method,
    );
    const withId: string = !isError ? `con ID ${id}` : '';
    const resultStatus: string = !isError ? 'fue exitosa' : 'falló';
    const description: string = `La acción ${actionType} objeto ${withId} realizada en el módulo ${moduleName} ${resultStatus}`;
    return {
      description,
      moduleName,
      actionType,
      isSuccessfully: !isError,
      createdBy: userId,
      createdAt: new Date(),
    };
  }
}
