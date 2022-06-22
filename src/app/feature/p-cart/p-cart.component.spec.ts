import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PCartComponent } from './p-cart.component';

describe('PCartComponent', () => {
  let component: PCartComponent;
  let fixture: ComponentFixture<PCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
