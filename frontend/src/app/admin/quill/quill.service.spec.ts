import { TestBed } from '@angular/core/testing';

import { QuillService } from './quill.service';

describe('QuillService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuillService = TestBed.get(QuillService);
    expect(service).toBeTruthy();
  });
});
