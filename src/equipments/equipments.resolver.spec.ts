import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentsResolver } from './equipments.resolver';
import { EquipmentsService } from './equipments.service';

describe('EquipmentsResolver', () => {
  let resolver: EquipmentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentsResolver, EquipmentsService],
    }).compile();

    resolver = module.get<EquipmentsResolver>(EquipmentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
