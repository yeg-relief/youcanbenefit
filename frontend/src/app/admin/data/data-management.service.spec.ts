import { TestBed, inject } from '@angular/core/testing';

import { DataManagementService } from './data-management.service';

describe('DataManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataManagementService]
    });
  });

  it('should be created', inject([DataManagementService], (service: DataManagementService) => {
    expect(service).toBeTruthy();
  }));
});
