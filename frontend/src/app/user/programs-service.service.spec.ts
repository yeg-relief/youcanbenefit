import { TestBed, inject } from '@angular/core/testing';

import { ProgramsServiceService } from './programs-service.service';

describe('ProgramsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgramsServiceService]
    });
  });

  it('should be created', inject([ProgramsServiceService], (service: ProgramsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
