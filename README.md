

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Migrations
### Generate Migration
```bash
yarn migration:generate src/migrations/MigrationName
```

### Run Migrations
```bash
yarn migration:run
or
docker compose exec backend yarn migration:run
```

### Revert Last Migration
```bash
yarn migration:revert
```

### Show Executed Migrations
```bash
yarn migration:show
```

### How to Create a New Migration

### 1. Modify the Entity
First modify your entity (e.g., `src/user/entities/user.entity.ts`):

```typescript
// Add new column
@Column({ nullable: true })
newColumn: string;
```

### 2. Generate Migration
```bash
yarn migration:generate src/migrations/AddNewColumn
```

### 3. Review and Edit the Migration
The migration will be generated in `src/migrations/`. Review and edit if necessary:

```typescript
export class AddNewColumn1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add column
    await queryRunner.query(`ALTER TABLE "USERS" ADD "NEW_COLUMN" VARCHAR2(255)`);
    
    // Update existing data if necessary
    await queryRunner.query(`UPDATE "USERS" SET "NEW_COLUMN" = 'default_value' WHERE "NEW_COLUMN" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert changes
    await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "NEW_COLUMN"`);
  }
}
```

### 4. Run Migration
```bash
yarn migration:run
```

## Example: Adding a New Column

### Step 1: Modify Entity
```typescript
// In src/user/entities/user.entity.ts
@Column({ nullable: true, default: '' })
newColumn: string;
```

### Step 2: Generate Migration
```bash
yarn migration:generate src/migrations/AddNewColumn
```

### Step 3: Execute
```bash
yarn migration:run
```

## Oracle Considerations

- Columns in Oracle are created in uppercase by default
- Use `VARCHAR2` instead of `VARCHAR`
- For default values, use `DEFAULT` in the column definition
- Migrations must handle existing data explicitly

## File Structure

```
src/
├── migrations/
│   ├── 1700000000000-InitialMigration.ts
│   ├── 1700000000001-AddDefaultData.ts
│   └── [new-migrations].ts
├── user/entities/user.entity.ts
├── role/entities/role.entity.ts
└── database/database.module.ts
```
