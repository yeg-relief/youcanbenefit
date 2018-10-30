/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormGroup, FormControl, FormControlName } from '@angular/forms';
import { YcbQuestionComponent } from './ycb-question.component';
import { QuestionControlService } from '../questions/question-control.service';
import { YcbConditionalQuestionComponent } from './ycb-conditional-question/ycb-conditional-question.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('YcbQuestionComponent', () => {
  let component: YcbQuestionComponent;
  let fixture: ComponentFixture<YcbQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [ YcbQuestionComponent, YcbConditionalQuestionComponent ],
      providers: [ QuestionControlService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YcbQuestionComponent);
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

  it('should display a number question', () => {
    const label = fixture.debugElement.query(By.css('#question-label'));
    expect(label).not.toBeNull();
    expect(label.nativeElement.innerText).toEqual('a fake question')

    const input = fixture.debugElement.query(By.directive(FormControlName))
    expect(input).not.toBeNull();
  })
});
