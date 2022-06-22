import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PDetailComponent } from './p-detail.component';

describe('PDetailComponent', () => {
  let component: PDetailComponent;
  let fixture: ComponentFixture<PDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
