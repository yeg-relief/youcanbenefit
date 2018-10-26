import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryDisplayComponent } from './query-display.component';

describe('QueryDisplayComponent', () => {
  let component: QueryDisplayComponent;
  let fixture: ComponentFixture<QueryDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
