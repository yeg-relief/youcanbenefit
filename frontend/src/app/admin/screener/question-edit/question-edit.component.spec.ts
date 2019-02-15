import { async, ComponentFixture, TestBed,  } from '@angular/core/testing';
import { QuestionEditComponent } from './question-edit.component';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, FormControlName } from '@angular/forms';
import { StoreModule, } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import * as fromRoot from '../../reducer';
import * as fromScreener from '../store/screener-reducer';
import { QuestionEditErrorComponent } from './question-edit-error/question-edit-error.component';

const questionOne = new FormGroup({
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




describe('QuestionEditComponent', () => {
  let component: QuestionEditComponent;
  let fixture: ComponentFixture<QuestionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionEditComponent, QuestionEditErrorComponent ],
      imports: [ 
        MaterialModule, 
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    
    
    expect(component).toBeTruthy();
  });

  it('should display data representative of questionOne', () => {
    const formControls = fixture.debugElement.queryAll(By.directive(FormControlName));
    
    const label = formControls.find( debugElem => debugElem.attributes.formControlName === 'label');
    expect(label).toBeDefined();
    expect(label.nativeElement.value).toEqual('question label');

    const controlType = formControls.find( debugElem => debugElem.attributes.formControlName === 'controlType');
    expect(controlType).toBeDefined();
    expect(controlType.nativeElement.textContent).toEqual('Input Type  ');

    const expandable = formControls.find( debugElem => debugElem.attributes.formControlName === 'expandable');
    expect(expandable).toBeDefined();
    expect(expandable.nativeElement.getElementsByTagName('input')[0].checked).toEqual(false);

    const name = formControls.find( debugElem => debugElem.attributes.formControlName === 'name' );

    expect(name.nativeElement.textContent.replace(/\s+/g, ''))
      .toEqual('boolean_key:booleaninteger_key:integer');

    expect(name.nativeElement.value).toEqual('boolean_key');
  })
});

