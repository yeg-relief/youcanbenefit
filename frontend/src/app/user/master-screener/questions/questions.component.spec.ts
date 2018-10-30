/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormGroup, FormControl, FormControlName } from '@angular/forms';
import { QuestionsComponent } from './questions.component';
import { QuestionControlService } from '../questions/question-control.service';
import { YcbQuestionComponent } from '../ycb-question/ycb-question.component';
import { YcbConditionalQuestionComponent } from '../ycb-question/ycb-conditional-question/ycb-conditional-question.component'
import { MasterScreenerService } from '../master-screener.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Questions Component single question', () => {
  let component: QuestionsComponent;
  let fixture: ComponentFixture<QuestionsComponent>;
  let de: DebugElement;
  let router: Router;
  let mssrv: MasterScreenerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [QuestionsComponent, YcbQuestionComponent, YcbConditionalQuestionComponent],
      providers: [
        MasterScreenerService,
        QuestionControlService,
        { provide: Router, useClass: class { navigateByUrl = jasmine.createSpy("navigateByUrl"); } },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    router = TestBed.get(Router);
    mssrv = TestBed.get(MasterScreenerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.loading).toBeFalsy();
  });

  it('should have one question', () => {
    const questions = de.queryAll(By.css('app-ycb-question'));
    expect(questions).not.toBeNull();
    expect(questions.length).toEqual(1);

    const submitBtn = de.query(By.css('button[type="submit"]'));
    expect(submitBtn).not.toBeNull();
    expect(submitBtn.nativeElement.disabled).toBe(true);
  });

  it('should have a form with a "boolean_key" value', () => {
    const values = component.form.value;
    expect(values['boolean_key']).not.toBeUndefined();
    expect(values['boolean_key']).toEqual('');
  });

  it('should associate a conditional question with its host question', () => {
    expect(component.gatherConditionals(component.questions[0])).toEqual(component.conditionalQuestions)
  });

  it('should add a conditional control to form when the host question is true', () => {
    const form = component.form;
    expect(form.value['boolean_key']).not.toBeUndefined();
    expect(form.value['number_key']).toBeNull();
    form.get('boolean_key').setValue(true);
    expect(form.value['boolean_key']).not.toBeUndefined();
    expect(form.value['number_key']).not.toBeUndefined();
  });

  it('should update the UI to show a constant and conditional question', done => {
    const expand = de.query(By.css('md-checkbox'))
    const input = expand.query(By.css('input'))
    input.nativeElement.click();
    input.nativeElement.checked = true;;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const questions = de.queryAll(By.css('app-ycb-question'));
      const conditionals = de.queryAll(By.css('app-ycb-conditional-question'));
      expect(questions).not.toBeNull();
      expect(conditionals).not.toBeNull();
      expect(questions.length + conditionals.length).toEqual(2);
      done();
    });
  });
});

class MockActivatedRoute {
  snapshot: Object;

  constructor() {
    this.snapshot = {
      data: {
        questions: {
          questions: [{
            key: 'boolean_key',
            label: 'a fake question',
            controlType: 'Toggle',
            id: 'fake_id',
            index: 0,
            options: undefined,
            conditionalQuestions: ['fake_id_two'],
            expandable: true
          }],
          conditionalQuestions:
          [{
              key: 'number_key',
              label: 'a fake question',
              controlType: 'NumberInput',
              id: 'fake_id_two',
              index: 0,
              options: undefined,
              conditionalQuestions: undefined,
              expandable: false
          }],
        },

        error: undefined
      }
    };
  }
};
