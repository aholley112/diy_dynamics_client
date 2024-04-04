import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesBoardComponent } from './favorites-board.component';

describe('FavoritesBoardComponent', () => {
  let component: FavoritesBoardComponent;
  let fixture: ComponentFixture<FavoritesBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoritesBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
