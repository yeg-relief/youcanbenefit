import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { KeyFilterService } from './key-filter.service';

describe('KeyFilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyFilterService]
    });
  });
  it('should ... TODO: consider deleting', inject([KeyFilterService], (service: KeyFilterService) => {
    expect(service).toBeTruthy();
  }));
});
