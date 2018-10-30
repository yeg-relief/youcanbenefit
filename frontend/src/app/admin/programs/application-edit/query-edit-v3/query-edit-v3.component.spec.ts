import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryEditV3Component } from './query-edit-v3.component';

describe('QueryEditV3Component', () => {
  let component: QueryEditV3Component;
  let fixture: ComponentFixture<QueryEditV3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryEditV3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryEditV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
