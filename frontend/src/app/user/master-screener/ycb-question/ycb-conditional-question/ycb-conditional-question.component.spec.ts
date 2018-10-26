/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { YcbConditionalQuestionComponent } from './ycb-conditional-question.component';

describe('YcbConditionalQuestionComponent', () => {
  let component: YcbConditionalQuestionComponent;
  let fixture: ComponentFixture<YcbConditionalQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule, ReactiveFormsModule ], 
      declarations: [ YcbConditionalQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YcbConditionalQuestionComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      number_key: new FormControl(0)
    });
    component.question = {
      key: 'number_key',
      label: 'a fake question',
      controlType: 'NumberInput',
      id: 'fake_id',
      index: 0,
      options: [],
      conditionalQuestions: [],
      expandable: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
