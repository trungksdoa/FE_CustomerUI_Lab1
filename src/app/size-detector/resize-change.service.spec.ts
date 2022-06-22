import { TestBed } from '@angular/core/testing';

import { ResizeChangeService } from './resize-change.service';

describe('ResizeChangeService', () => {
  let service: ResizeChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResizeChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
