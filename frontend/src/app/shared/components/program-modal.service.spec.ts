import { TestBed, inject } from '@angular/core/testing';

import { ProgramModalService } from './program-modal.service';

describe('ProgramModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgramModalService]
    });
  });

  it('should be created', inject([ProgramModalService], (service: ProgramModalService) => {
    expect(service).toBeTruthy();
  }));
});
