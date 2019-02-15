/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ScreenerOverviewComponent } from './screener-overview.component';
import { StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as fromRoot from '../../reducer';
import * as fromScreener from '../store/screener-reducer';
import { DragDropManagerService } from '../question-list/drag-drop-manager.service';
import { QuestionListComponent } from '../question-list/question-list.component'
import { ScreenerToolbarComponent } from '../screener-toolbar/screener-toolbar.component'
import { QuestionEditComponent } from '../question-edit/question-edit.component'
import { AuthService } from '../../core/services/auth.service'
import { QuestionEditErrorComponent } from '../question-edit/question-edit-error/question-edit-error.component';
declare const btoa;

const questionOne = new FormGroup({
  key: new FormGroup({
    name: new FormControl('boolean_key'),
    type: new FormControl('boolean')
  }),
  label: new FormControl('question label'),
  controlType: new FormControl('Toggle'),
  id: new FormControl('fake_id'),
  index: new FormControl(0),
  options: new FormControl([]),
  conditionalQuestions: new FormControl([]),
  expandable: new FormControl(false)
});

const form = new FormGroup({});
form.addControl('fake_id', questionOne);


const screenerState: fromScreener.State  = {
  loading: false,
  form: form,
  error: '',
  selectedConstantQuestion: 'fake_id',
  selectedConditionalQuestion: undefined,
  created: 0
};

class MockAuthService {
  credentials: string;
  login(){
    this.credentials = btoa('user' + ":" + 'password');
    return Observable.of({login: true})
  }
}


describe('ScreenerOverviewComponent', () => {
  let component: ScreenerOverviewComponent;
  let fixture: ComponentFixture<ScreenerOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        MaterialModule, 
        ReactiveFormsModule, 
        BrowserAnimationsModule,
        StoreModule.provideStore(fromRoot.reducer, { 
          screener: screenerState, 
          keyOverview: fromKeys.initialState,
        }), 
      ],
      providers: [ DragDropManagerService, {provide: AuthService, useClass: MockAuthService} ],
      declarations: [ 
        ScreenerOverviewComponent,
        ScreenerToolbarComponent,
        QuestionListComponent,
        QuestionEditComponent,
        QuestionEditErrorComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenerOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a single constant question', () => {
    expect(fixture.debugElement.queryAll(By.css('app-screener-toolbar'))).not.toBeNull();
    expect(fixture.debugElement.queryAll(By.css('app-screener-toolbar')).length).toEqual(1);
    const screenerContent = fixture.debugElement.query(By.css('#screener-content'));
    expect(screenerContent).not.toBeNull();
    const questionLists = screenerContent.queryAll(By.css('app-question-list'));
    expect(questionLists).not.toBeNull();
    expect(questionLists.length).toEqual(1);
    const constantList = screenerContent.query(By.css('#constant-question-list'));
    expect(constantList).not.toBeNull();
    const questionContent = screenerContent.query(By.css('#question-content'));
    expect(questionContent).not.toBeNull();
    const questionEdit = questionContent.query(By.css('app-question-edit'));
    expect(questionEdit).not.toBeNull();
  });
});
