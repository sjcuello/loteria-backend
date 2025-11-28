import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAppointmentsTable1732800000000
  implements MigrationInterface
{
  name = 'CreateAppointmentsTable1732800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE "SEQ_VISITA" START WITH 1 INCREMENT BY 1`,
    );
    await queryRunner.query(
      `CREATE TABLE "T_VISITA" (
      "ID_VISITA" number DEFAULT "SEQ_VISITA".NEXTVAL NOT NULL,
      "VISITANTE_ID" number NOT NULL,
      "MOTIVO" clob NOT NULL,
      "USER_ID" number NOT NULL,
      "FECHA_INICIO" timestamp NOT NULL,
      "FECHA_FIN" timestamp,
      "ES_INSTANTANEA" number DEFAULT 0 NOT NULL,
      "FECHA_INICIO_EFECTIVA" timestamp,
      "FECHA_FIN_EFECTIVA" timestamp,
      "APROBADO" number DEFAULT 0 NOT NULL,
      "APROBADO_POR" number,
      "FEC_ALTA" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "USR_ALTA" number,
      "FEC_MODIF" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "USR_MODIF" number,
      CONSTRAINT "PK_VISITA" PRIMARY KEY ("ID_VISITA"),
      CONSTRAINT "FK_VISITA_VISITANTE" FOREIGN KEY ("VISITANTE_ID") REFERENCES "T_VISITANTES" ("ID_VISITANTE"),
      CONSTRAINT "FK_VISITA_USER" FOREIGN KEY ("USER_ID") REFERENCES "T_USUARIOS" ("ID_USUARIOS"),
      CONSTRAINT "FK_VISITA_APROBADO_POR" FOREIGN KEY ("APROBADO_POR") REFERENCES "T_USUARIOS" ("ID_USUARIOS"),
      CONSTRAINT "FK_VISITA_CREATED_BY" FOREIGN KEY ("USR_ALTA") REFERENCES "T_USUARIOS" ("ID_USUARIOS"),
      CONSTRAINT "FK_VISITA_UPDATED_BY" FOREIGN KEY ("USR_MODIF") REFERENCES "T_USUARIOS" ("ID_USUARIOS")
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_VISITA_VISITANTE" ON "T_VISITA" ("VISITANTE_ID")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_VISITA_USER" ON "T_VISITA" ("USER_ID")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_VISITA_FECHA_INICIO" ON "T_VISITA" ("FECHA_INICIO")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_VISITA_APROBADO" ON "T_VISITA" ("APROBADO")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_VISITA_ES_INSTANTANEA" ON "T_VISITA" ("ES_INSTANTANEA")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_VISITA_ES_INSTANTANEA"`);
    await queryRunner.query(`DROP INDEX "IDX_VISITA_APROBADO"`);
    await queryRunner.query(`DROP INDEX "IDX_VISITA_FECHA_INICIO"`);
    await queryRunner.query(`DROP INDEX "IDX_VISITA_USER"`);
    await queryRunner.query(`DROP INDEX "IDX_VISITA_VISITANTE"`);
    await queryRunner.query(
      `ALTER TABLE "T_VISITA" DROP CONSTRAINT "FK_VISITA_UPDATED_BY"`,
    );
    await queryRunner.query(
      `ALTER TABLE "T_VISITA" DROP CONSTRAINT "FK_VISITA_CREATED_BY"`,
    );
    await queryRunner.query(
      `ALTER TABLE "T_VISITA" DROP CONSTRAINT "FK_VISITA_APROBADO_POR"`,
    );
    await queryRunner.query(
      `ALTER TABLE "T_VISITA" DROP CONSTRAINT "FK_VISITA_USER"`,
    );
    await queryRunner.query(
      `ALTER TABLE "T_VISITA" DROP CONSTRAINT "FK_VISITA_VISITANTE"`,
    );
    await queryRunner.query(
      `ALTER TABLE "T_VISITA" DROP CONSTRAINT "PK_VISITA"`,
    );
    await queryRunner.query(`DROP TABLE "T_VISITA"`);
    await queryRunner.query(`DROP SEQUENCE "SEQ_VISITA"`);
  }
}
