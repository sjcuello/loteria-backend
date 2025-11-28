import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from '@nestjs/config';
import { PanelModule } from './panel/panel.module';
import { PanelModuleModule } from './panel-module/panel-module.module';
import { UsageModule } from './usage/usage.module';
import { FeeFormulaModule } from './fee-formula/fee-formula.module';
import { HolderModule } from './holder/holder.module';
import { AccountModule } from './account/account.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { FeeFormulaHistoryModule } from './fee-formula-history/fee-formula-history.module';
import { ParameterModule } from './parameter/parameter.module';
import { FeeFormulaParameterModule } from './fee-formula-parameter/fee-formula-parameter.module';
import { ParameterValueModule } from './parameter-value/parameter-value.module';
import { ConstantValueModule } from './constant-value/constant-value.module';
import { HealthModule } from './health/health.module';
import { SubcategoryFormulaModule } from './subcategory-formula/subcategory-formula.module';
import { SimulationModule } from './simulation/simulation.module';
import { UsageAdminModule } from './usage-admin/usage-admin.module';
import { DdjjModule } from './ddjj/ddjj.module';
import { DeclarationModule } from './declaration/declaration.module';
import { MeasurementModule } from './measurement/measurement.module';
import { CsvImportModule } from './csv-import/csv-import.module';
import { CorsMiddleware } from './middleware/cors.middleware';
import { CidiQueryModule } from './cidi-query/cidi-query.module';
import { AccountDetailModule } from './account-detail/account-detail.module';
import { CidiModule } from './cidi/cidi.module';
import { ControlAuditModule } from './control-audit/control-audit.module';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import {
  DatabaseExceptionFilter,
  ValidationExceptionFilter,
} from './shared/filters';
import { ScenarioModule } from './scenario/scenario.module';
import { ModelModule } from './model/model.module';
import { ModelDetailModule } from './model-detail/model-detail.module';
import { ModelDetailValueModule } from './model-detail-value/model-detail-value.module';
import { InternalNotificationModule } from './internal-notification/internal-notification.module';
import { ConstantValueHistoryModule } from './constant-value-history/constant-value-history.module';

const modules = [
  AccountModule,
  AccountDetailModule,
  CategoryModule,
  CidiModule,
  CidiQueryModule,
  ConstantValueModule,
  ConstantValueHistoryModule,
  ControlAuditModule,
  CsvImportModule,
  DatabaseModule,
  DdjjModule,
  DeclarationModule,
  FeeFormulaModule,
  FeeFormulaHistoryModule,
  FeeFormulaParameterModule,
  ParameterModule,
  HealthModule,
  HolderModule,
  InternalNotificationModule,
  MeasurementModule,
  ModelModule,
  ModelDetailModule,
  ModelDetailValueModule,
  PanelModule,
  PanelModuleModule,
  ParameterValueModule,
  ScenarioModule,
  SimulationModule,
  SubcategoryModule,
  SubcategoryFormulaModule,
  RoleModule,
  UsageAdminModule,
  UsageModule,
  UserModule,
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
