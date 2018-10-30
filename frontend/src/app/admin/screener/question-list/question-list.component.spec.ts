/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { QuestionListComponent } from './question-list.component';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as fromRoot from '../../reducer';
import * as fromScreener from '../store/screener-reducer';
import * as fromKeys from '../../keys/reducer';
import { DragDropManagerService } from './drag-drop-manager.service';
import { KeyFilterService } from '../services/key-filter.service';


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
  keys: [
    {name: 'boolean_key', type: 'boolean'},
    {name: 'integer_key', type: 'integer'}
  ],
  created: 0
};



describe('QuestionListComponent', () => {
  let component: QuestionListComponent;
  let fixture: ComponentFixture<QuestionListComponent>;

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
      providers: [ DragDropManagerService, KeyFilterService ],
      declarations: [ QuestionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionListComponent);
    component = fixture.componentInstance;
    component.questions = ['fake_id'];
    component.type = 'constant';
    component.form = form;
    fixture.detectChanges();
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a single constant question', () => {
    const questionListHeader = fixture.debugElement.query(By.css('#constant_container'));
    expect(questionListHeader).not.toBeNull();
    const h3 = questionListHeader.query(By.css('h3'));
    expect(h3).not.toBeNull();
    expect(h3.nativeElement.innerText).toEqual('Screener Questions');
    const headerButton = questionListHeader.query(By.css('button'));
    expect(headerButton).not.toBeNull();
    
    component.questions.forEach( id=> {
      const question = fixture.debugElement.query(By.css(`#${id}-constant-list-item`));
      expect(question).not.toBeNull();
      const [key, controlType] = question.queryAll(By.css('h4')).map(i => i.nativeElement.innerText);
      expect(key).toEqual(form.get([id, 'key']).value.name);
      expect(controlType).toEqual(form.get([id, 'controlType']).value)
    })
    
  })
});
