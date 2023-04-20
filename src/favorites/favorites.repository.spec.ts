import { Test, TestingModule } from '@nestjs/testing';
import FavoritesRepository from './favorites.repository';

describe('FavoritesRepository', () => {
  let provider: FavoritesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoritesRepository],
    }).compile();

    provider = module.get<FavoritesRepository>(FavoritesRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
