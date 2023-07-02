import { Test, TestingModule } from '@nestjs/testing';
import { LevelEngService } from './level-eng.service';

describe('LevelEngService', () => {
  let service: LevelEngService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LevelEngService],
    }).compile();

    service = module.get<LevelEngService>(LevelEngService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
