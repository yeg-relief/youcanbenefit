import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionEditV3Component } from './condition-edit-v3.component';

describe('ConditionEditV3Component', () => {
  let component: ConditionEditV3Component;
  let fixture: ComponentFixture<ConditionEditV3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionEditV3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionEditV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
