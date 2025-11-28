import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialTables1750000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create sequences with specific names
    await queryRunner.query(
      `CREATE SEQUENCE "SEQ_USUARIOS" START WITH 1 INCREMENT BY 1`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE "SEQ_ROLES" START WITH 1 INCREMENT BY 1`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE "SEQ_AREA" START WITH 1 INCREMENT BY 1`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE "SEQ_VISITANTES" START WITH 1 INCREMENT BY 1`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE "SEQ_PANELES" START WITH 1 INCREMENT BY 1`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE "SEQ_MODULOS_PANEL" START WITH 1 INCREMENT BY 1`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE "SEQ_AUDITORIA" START WITH 1 INCREMENT BY 1`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE "SEQ_VISITA" START WITH 1 INCREMENT BY 1`,
    );

    // Create role table first (referenced by user)
    await queryRunner.query(`
      CREATE TABLE "T_ROLES" (
        "ID_ROLES" NUMBER DEFAULT "SEQ_ROLES".NEXTVAL NOT NULL,
        "NOMBRE" VARCHAR2(255) NOT NULL,
        "DESCRIPCION" VARCHAR2(500),
        "ACTIVO" NUMBER(1) DEFAULT 1 NOT NULL,
        "FEC_ALTA" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "USR_ALTA" NUMBER,
        "FEC_MODIF" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "USR_MODIF" NUMBER,
        CONSTRAINT "PK_ROLES" PRIMARY KEY ("ID_ROLES"),
        CONSTRAINT "UQ_ROLES_NOMBRE" UNIQUE ("NOMBRE"),
        CONSTRAINT "CHK_ROLES_ACTIVO" CHECK ("ACTIVO" IN (0, 1))
      )
    `);

    // Create area table
    await queryRunner.query(`
      CREATE TABLE "T_AREA" (
        "ID_AREA" NUMBER DEFAULT "SEQ_AREA".NEXTVAL NOT NULL,
        "NOMBRE" VARCHAR2(255) NOT NULL,
        "DESCRIPCION" CLOB,
        "CODIGO_AREA" VARCHAR2(50) NOT NULL,
        "ACTIVO" NUMBER(1) DEFAULT 1 NOT NULL,
        "FEC_ALTA" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "USR_ALTA" NUMBER,
        "FEC_MODIF" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "USR_MODIF" NUMBER,
        CONSTRAINT "PK_AREA" PRIMARY KEY ("ID_AREA"),
        CONSTRAINT "UQ_AREA_CODIGO" UNIQUE ("CODIGO_AREA"),
        CONSTRAINT "CHK_AREA_ACTIVO" CHECK ("ACTIVO" IN (0, 1))
      )
    `);

    // Create user table
    await queryRunner.query(`
      CREATE TABLE "T_USUARIOS" (
        "ID_USUARIOS" number DEFAULT "SEQ_USUARIOS".NEXTVAL NOT NULL,
        "NOMBRE" VARCHAR2(255) NOT NULL,
        "APELLIDO" VARCHAR2(255) NOT NULL,
        "DNI" VARCHAR2(255) NOT NULL,
        "CUIL" varchar2(255) UNIQUE,
        "ROL_ID" number,
        "AREA_ID" number,
        "ACTIVO" NUMBER(1) DEFAULT 1 NOT NULL,
        "USERNAME" VARCHAR2(100) UNIQUE,
        "PASSWORD" VARCHAR2(255),
        "FEC_ALTA" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "USR_ALTA" NUMBER,
        "FEC_MODIF" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "USR_MODIF" NUMBER,
        CONSTRAINT "PK_USUARIOS" PRIMARY KEY ("ID_USUARIOS"),
        CONSTRAINT "CHK_USUARIOS_ACTIVO" CHECK ("ACTIVO" IN (0, 1)),
        CONSTRAINT "FK_USUARIOS_ROLES" FOREIGN KEY ("ROL_ID") REFERENCES "T_ROLES" ("ID_ROLES"),
        CONSTRAINT "FK_USUARIOS_AREA" FOREIGN KEY ("AREA_ID") REFERENCES "T_AREA" ("ID_AREA"),
        CONSTRAINT "FK_USUARIOS_USUARIOS_ALTA" FOREIGN KEY ("USR_ALTA") REFERENCES "T_USUARIOS" ("ID_USUARIOS"),
        CONSTRAINT "FK_USUARIOS_USUARIOS_MODIF" FOREIGN KEY ("USR_MODIF") REFERENCES "T_USUARIOS" ("ID_USUARIOS")
      )
    `);

    // Add foreign key constraints to T_AREA after T_USUARIOS is created
    await queryRunner.query(`
      ALTER TABLE "T_AREA" ADD CONSTRAINT "FK_AREA_USUARIOS_ALTA" 
      FOREIGN KEY ("USR_ALTA") REFERENCES "T_USUARIOS" ("ID_USUARIOS")
    `);
    await queryRunner.query(`
      ALTER TABLE "T_AREA" ADD CONSTRAINT "FK_AREA_USUARIOS_MODIF" 
      FOREIGN KEY ("USR_MODIF") REFERENCES "T_USUARIOS" ("ID_USUARIOS")
    `);

    // Create panel table
    await queryRunner.query(`
      CREATE TABLE "T_PANELES" (
        "ID_PANELES" NUMBER DEFAULT "SEQ_PANELES".NEXTVAL NOT NULL,
        "NOMBRE" VARCHAR2(255) NOT NULL,
        "ACTIVO" NUMBER(1) DEFAULT 1 NOT NULL,
        "ROL_ID" NUMBER NOT NULL,
        "FEC_ALTA" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "USR_ALTA" NUMBER,
        "FEC_MODIF" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "USR_MODIF" NUMBER,
        CONSTRAINT "PK_PANELES" PRIMARY KEY ("ID_PANELES"),
        CONSTRAINT "FK_PANELES_ROLES" FOREIGN KEY ("ROL_ID") REFERENCES "T_ROLES" ("ID_ROLES"),
        CONSTRAINT "FK_PANELES_USUARIOS_ALTA" FOREIGN KEY ("USR_ALTA") REFERENCES "T_USUARIOS" ("ID_USUARIOS"),
        CONSTRAINT "FK_PANELES_USUARIOS_MODIF" FOREIGN KEY ("USR_MODIF") REFERENCES "T_USUARIOS" ("ID_USUARIOS")
      )
    `);

    // Create panel_module table
    await queryRunner.query(`
      CREATE TABLE "T_MODULOS_PANEL" (
        "ID_MODULOS_PANEL" NUMBER DEFAULT "SEQ_MODULOS_PANEL".NEXTVAL NOT NULL,
        "NOMBRE" VARCHAR2(255) NOT NULL,
        "DESCRIPCION" VARCHAR2(500),
        "ICONO" VARCHAR2(255),
        "LINK" VARCHAR2(255),
        "ACTIVO" NUMBER(1) DEFAULT 1 NOT NULL,
        "PANEL_ID" NUMBER NOT NULL,
        "FEC_ALTA" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "USR_ALTA" NUMBER,
        "FEC_MODIF" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "USR_MODIF" NUMBER,
        CONSTRAINT "PK_MODULOS_PANEL" PRIMARY KEY ("ID_MODULOS_PANEL"),
        CONSTRAINT "FK_MODULOS_PANEL_PANEL" FOREIGN KEY ("PANEL_ID") REFERENCES "T_PANELES" ("ID_PANELES"),
        CONSTRAINT "FK_MODULOS_PANEL_USUARIOS_ALTA" FOREIGN KEY ("USR_ALTA") REFERENCES "T_USUARIOS" ("ID_USUARIOS"),
        CONSTRAINT "FK_MODULOS_PANEL_USUARIOS_MODIF" FOREIGN KEY ("USR_MODIF") REFERENCES "T_USUARIOS" ("ID_USUARIOS")
      )
    `);

    // Create visitors table
    await queryRunner.query(`
      CREATE TABLE "T_VISITANTES" (
        "ID_VISITANTE" NUMBER DEFAULT "SEQ_VISITANTES".NEXTVAL NOT NULL,
        "NOMBRE" VARCHAR2(255) NOT NULL,
        "APELLIDO" VARCHAR2(255) NOT NULL,
        "DNI" VARCHAR2(255) NOT NULL,
        "CUIT" VARCHAR2(255) NOT NULL,
        "FEC_ALTA" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "USR_ALTA" NUMBER,
        "FEC_MODIF" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "USR_MODIF" NUMBER,
        CONSTRAINT "PK_VISITANTES" PRIMARY KEY ("ID_VISITANTE"),
        CONSTRAINT "UQ_VISITANTES_DNI" UNIQUE ("DNI"),
        CONSTRAINT "FK_VISITANTES_USUARIOS_ALTA" FOREIGN KEY ("USR_ALTA") REFERENCES "T_USUARIOS" ("ID_USUARIOS"),
        CONSTRAINT "FK_VISITANTES_USUARIOS_MODIF" FOREIGN KEY ("USR_MODIF") REFERENCES "T_USUARIOS" ("ID_USUARIOS")
      )
    `);

    // Create audit control table
    await queryRunner.query(`
      CREATE TABLE "T_AUDITORIA" (
        "ID_AUDITORIA" NUMBER DEFAULT "SEQ_AUDITORIA".NEXTVAL NOT NULL,
        "DESCRIPCION" VARCHAR2(500),
        "NOMBRE_MODULO" VARCHAR2(500),
        "TIPO_ACCION" VARCHAR2(500),
        "ESTADO" NUMBER(1) DEFAULT 1 NOT NULL,
        "FEC_ALTA" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "USR_ALTA" NUMBER,
        CONSTRAINT "PK_AUDITORIA" PRIMARY KEY ("ID_AUDITORIA"),
        CONSTRAINT "FK_AUDITORIA_USUARIOS_ALTA" FOREIGN KEY ("USR_ALTA") REFERENCES "T_USUARIOS" ("ID_USUARIOS"),
        CONSTRAINT "CHK_AUDITORIA_ESTADO" CHECK ("ESTADO" IN (0, 1))
      )
    `);

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

    // Insert default roles from seed file
    await queryRunner.query(`
      INSERT INTO "T_ROLES" ("ID_ROLES", "NOMBRE") VALUES (1, 'Administrador')
    `);
    await queryRunner.query(`
      INSERT INTO "T_ROLES" ("ID_ROLES", "NOMBRE") VALUES (2, 'Gerencial')
    `);
    await queryRunner.query(`
      INSERT INTO "T_ROLES" ("ID_ROLES", "NOMBRE") VALUES (3, 'Super Admin')
    `);
    await queryRunner.query(`
      INSERT INTO "T_ROLES" ("ID_ROLES", "NOMBRE") VALUES (4, 'Visitante')
    `);

    // Insert default areas
    await queryRunner.query(`
      INSERT INTO "T_AREA" ("ID_AREA", "NOMBRE", "DESCRIPCION", "CODIGO_AREA") VALUES (1, 'Contable', 'Área de Contabilidad', 'CONT')
    `);
    await queryRunner.query(`
      INSERT INTO "T_AREA" ("ID_AREA", "NOMBRE", "DESCRIPCION", "CODIGO_AREA") VALUES (2, 'Administration', 'Área de Administración', 'ADM')
    `);
    await queryRunner.query(`
      INSERT INTO "T_AREA" ("ID_AREA", "NOMBRE", "DESCRIPCION", "CODIGO_AREA") VALUES (3, 'Sistemas', 'Área de Sistemas', 'SIS')
    `);
    await queryRunner.query(`
      INSERT INTO "T_AREA" ("ID_AREA", "NOMBRE", "DESCRIPCION", "CODIGO_AREA") VALUES (4, 'Rrhh', 'Área de Recursos Humanos', 'RRHH')
    `);
    await queryRunner.query(`
      INSERT INTO "T_AREA" ("ID_AREA", "NOMBRE", "DESCRIPCION", "CODIGO_AREA") VALUES (5, 'Gerencia', 'Área de Gerencia', 'GER')
    `);
    await queryRunner.query(`
      INSERT INTO "T_AREA" ("ID_AREA", "NOMBRE", "DESCRIPCION", "CODIGO_AREA") VALUES (6, 'Set', 'Área de Set', 'SET')
    `);

    // Insert default user (you may want to change these credentials)
    // Default credentials: username: admin, password: admin123
    await queryRunner.query(`
      INSERT INTO "T_USUARIOS" ("ID_USUARIOS", "NOMBRE", "APELLIDO", "DNI", "CUIL", "ROL_ID", "ACTIVO", "USERNAME", "PASSWORD", "AREA_ID") 
      VALUES (1, 'Admin', 'User', '38329696', '20-38329696-0', 3, 1, 'admin', '$2b$10$.AxQcZXK9HdTUJso.Hx2NehM7xH86wB4rJz5Dyn0GkEcbgp9of/HW', 3)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order (respecting foreign key constraints)
    await queryRunner.query(`DROP TABLE "T_AUDITORIA"`);
    await queryRunner.query(`DROP TABLE "T_VISITANTES"`);
    await queryRunner.query(`DROP TABLE "T_MODULOS_PANEL"`);
    await queryRunner.query(`DROP TABLE "T_PANELES"`);
    await queryRunner.query(`DROP TABLE "T_USUARIOS"`);
    await queryRunner.query(`DROP TABLE "T_AREA"`);
    await queryRunner.query(`DROP TABLE "T_ROLES"`);

    // Drop sequences
    await queryRunner.query(`DROP SEQUENCE "SEQ_AUDITORIA"`);
    await queryRunner.query(`DROP SEQUENCE "SEQ_VISITANTES"`);
    await queryRunner.query(`DROP SEQUENCE "SEQ_MODULOS_PANEL"`);
    await queryRunner.query(`DROP SEQUENCE "SEQ_PANELES"`);
    await queryRunner.query(`DROP SEQUENCE "SEQ_AREA"`);
    await queryRunner.query(`DROP SEQUENCE "SEQ_ROLES"`);
    await queryRunner.query(`DROP SEQUENCE "SEQ_USUARIOS"`);
  }
}
