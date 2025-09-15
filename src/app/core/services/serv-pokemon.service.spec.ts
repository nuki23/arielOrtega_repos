import { TestBed } from '@angular/core/testing';

import { ServPokemonService } from './serv-pokemon.service';

describe('ServPokemonService', () => {
  let service: ServPokemonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServPokemonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
