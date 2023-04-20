import { Test, TestingModule } from '@nestjs/testing';
import PlanetsRepository from './planets.repository';

describe('PlanetsRepository', () => {
  let provider: PlanetsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanetsRepository],
    }).compile();

    provider = module.get<PlanetsRepository>(PlanetsRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
