import { TestBed, inject } from '@angular/core/testing';

import { InitialRedirectService } from './initial-redirect.service';

describe('InitialRedirectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitialRedirectService]
    });
  });

  it('should be created', inject([InitialRedirectService], (service: InitialRedirectService) => {
    expect(service).toBeTruthy();
  }));
});
