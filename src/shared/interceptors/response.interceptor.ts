import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE_METADATA } from './response-message.decorator';
import { ControlAuditService } from '../../control-audit/control-audit.service';
import { CreateControlAuditData } from '../utils/control-audit-data';

export type Response<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(
    private reflector: Reflector,
    private controlAuditService: ControlAuditService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next
      .handle()
      .pipe(map((res: T) => this.responseHandler(res, context)));
  }

  responseHandler(res: T, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<{ statusCode: number }>();
    const statusCode: number = response.statusCode;
    const message: string =
      this.reflector.get<string>(
        RESPONSE_MESSAGE_METADATA,
        context.getHandler(),
      ) || 'Operación realizada con éxito';

    // Save audit log
    const request = ctx.getRequest<{
      url: string;
      method: string;
    }>();

    const moduleName: string = request.url.replace(/^\//, '').split(/[/?]/)[0];
    const id = res != undefined && res['id'] != null ? String(res['id']) : '';
    if (request.method != 'GET' && moduleName != '') {
      const data = CreateControlAuditData.create(false, moduleName, ctx, id);
      void this.controlAuditService.create(data);
    }

    return {
      success: true,
      statusCode,
      message,
      data: res,
    };
  }

  getCommonPathSegment(path: string): string {
    return path.split('/').filter(Boolean)[0] || '';
  }
}
