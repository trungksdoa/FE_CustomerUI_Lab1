import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPaymentComponent } from './p-payment.component';

describe('PPaymentComponent', () => {
  let component: PPaymentComponent;
  let fixture: ComponentFixture<PPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
