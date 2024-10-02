import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service'; // Adjust path if necessary

async function runSeeding() {
  const app = await NestFactory.createApplicationContext(AppModule); // Doesn't start HTTP server, just the context
  const seedService = app.get(SeedService);

  try {
    await seedService.seed();
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close(); // Ensure that the application context is properly closed
  }
}

// Call the seeding function ONLY when this file is executed manually.
if (require.main === module) {
  runSeeding();
}
