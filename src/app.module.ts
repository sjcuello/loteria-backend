import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from '@nestjs/config';
import { PanelModule } from './panel/panel.module';
import { PanelModuleModule } from './panel-module/panel-module.module';
import { HealthModule } from './health/health.module';
import { CorsMiddleware } from './middleware/cors.middleware';
import { ControlAuditModule } from './control-audit/control-audit.module';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import {
  DatabaseExceptionFilter,
  ValidationExceptionFilter,
} from './shared/filters';
import { InternalNotificationModule } from './internal-notification/internal-notification.module';
import { VisitorModule } from './visitor/visitor.module';
import { AreaModule } from './area/area.module';
import { AuthModule } from './auth/auth.module';

const modules = [
  AreaModule,
  AuthModule,
  ControlAuditModule,
  DatabaseModule,
  HealthModule,
  InternalNotificationModule,
  PanelModule,
  PanelModuleModule,
  RoleModule,
  UserModule,
  VisitorModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...modules,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
