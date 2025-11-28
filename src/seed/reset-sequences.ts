#!/usr/bin/env node

/**
 * Standalone script to reset Oracle sequences after manual data insertion
 * This script can be run independently to fix sequence issues
 */

import typeormConfig from '../../typeorm.config';
import { DataSource } from 'typeorm';

async function resetSequences(providedDataSource?: DataSource): Promise<void> {
  console.log('🔄 Resetting Oracle sequences...');

  const dataSource = providedDataSource || typeormConfig;
  const shouldManageConnection = !providedDataSource;

  try {
    if (shouldManageConnection) {
      await dataSource.initialize();
    }
    console.log('🚀 Database connection established');

    // Map of table names to their sequences (standardized naming from migration)
    const tableSequenceMap: Record<
      string,
      { table: string; sequence: string; idColumn: string }
    > = {
      T_ROLES: {
        table: 'T_ROLES',
        sequence: 'SEQ_ROLES',
        idColumn: 'ID_ROLES',
      },
      T_USUARIOS: {
        table: 'T_USUARIOS',
        sequence: 'SEQ_USUARIOS',
        idColumn: 'ID_USUARIOS',
      },
      T_PANELES: {
        table: 'T_PANELES',
        sequence: 'SEQ_PANELES',
        idColumn: 'ID_PANELES',
      },
      T_MODULOS_PANEL: {
        table: 'T_MODULOS_PANEL',
        sequence: 'SEQ_MODULOS_PANEL',
        idColumn: 'ID_MODULOS_PANEL',
      },
      T_VISITANTES: {
        table: 'T_VISITANTES',
        sequence: 'SEQ_VISITANTES',
        idColumn: 'ID_VISITANTE',
      },
    };

    for (const config of Object.values(tableSequenceMap)) {
      try {
        // Get the actual maximum ID from the table
        const result: unknown = await dataSource.query(`
          SELECT NVL(MAX("${config.idColumn}"), 0) as max_id FROM "${config.table}"
        `);
        const typedResult = result as Array<{ MAX_ID: number }>;
        const maxId = typedResult[0]?.MAX_ID || 0;

        if (maxId > 0) {
          // Check if sequence exists
          const sequenceQuery: unknown = await dataSource.query(`
            SELECT sequence_name 
            FROM user_sequences 
            WHERE sequence_name = '${config.sequence}'
          `);
          const sequenceResult = sequenceQuery as Array<{
            SEQUENCE_NAME: string;
          }>;

          if (sequenceResult.length > 0) {
            // Drop and recreate the sequence with the correct starting value
            await dataSource.query(`DROP SEQUENCE "${config.sequence}"`);
            await dataSource.query(`
              CREATE SEQUENCE "${config.sequence}" 
              START WITH ${maxId + 1} 
              INCREMENT BY 1 
              NOCACHE
            `);

            console.log(
              `✅ Reset sequence ${config.sequence} for table ${config.table} to start at ${
                maxId + 1
              }`,
            );
          } else {
            // Create a new sequence if none exists
            await dataSource.query(`
              CREATE SEQUENCE "${config.sequence}" 
              START WITH ${maxId + 1} 
              INCREMENT BY 1 
              NOCACHE
            `);

            console.log(
              `✅ Created new sequence ${config.sequence} for table ${config.table} starting at ${
                maxId + 1
              }`,
            );
          }
        } else {
          console.log(
            `ℹ️ Table ${config.table} is empty, skipping sequence reset`,
          );
        }
      } catch (error) {
        console.warn(
          `⚠️ Could not reset sequence for table ${config.table}:`,
          error,
        );
      }
    }

    console.log('🎉 Sequence reset completed successfully!');
  } catch (error) {
    console.error('❌ Error during sequence reset:', error);
    process.exit(1);
  } finally {
    if (shouldManageConnection) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script if executed directly
if (require.main === module) {
  resetSequences().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}

export { resetSequences };
