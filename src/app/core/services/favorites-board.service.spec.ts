import { TestBed } from '@angular/core/testing';

import { FavoritesBoardService } from './favorites-board.service';

describe('FavoritesBoardService', () => {
  let service: FavoritesBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
