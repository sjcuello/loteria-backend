import { runSeeder } from './run-seed';
import typeormConfig from '../../typeorm.config';

async function main() {
  try {
    await typeormConfig.initialize();
    console.log('🚀 Database connection established');

    await runSeeder(typeormConfig);

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await typeormConfig.destroy();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}
