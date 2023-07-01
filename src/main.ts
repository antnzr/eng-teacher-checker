import { AppModule } from './app.module';
import { CommandFactory } from 'nest-commander';
import { log } from './core/logger';

async function bootstrap() {
  await CommandFactory.run(AppModule, log);
}

bootstrap();
