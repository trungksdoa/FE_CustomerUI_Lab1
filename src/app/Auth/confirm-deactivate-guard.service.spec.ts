import { TestBed } from '@angular/core/testing';

import { ConfirmDeactivateGuardService } from './confirm-deactivate-guard.service';

describe('ConfirmDeactivateGuardService', () => {
  let service: ConfirmDeactivateGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmDeactivateGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
