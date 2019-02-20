/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ScreenerToolbarComponent } from './screener-toolbar.component';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'
import { StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../reducer';
import * as fromScreener from '../store/screener-reducer';
import { AuthService } from '../../core/services/auth.service'

declare const btoa;

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


class MockAuthService {
  credentials: string;
  login(){
    this.credentials = btoa('user' + ":" + 'password');
    return Observable.of({login: true})
  }
}

describe('ScreenerToolbarComponent', () => {
  let component: ScreenerToolbarComponent;
  let fixture: ComponentFixture<ScreenerToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule, 
        ReactiveFormsModule,
        StoreModule.provideStore(fromRoot.reducer, { 
          screener: screenerState, 
          keyOverview: fromKeys.initialState,
        })
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ],
      declarations: [ ScreenerToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenerToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should conform to this display TODO: think of better description', () => {
    const meta = fixture.debugElement.queryAll(By.css('mat-card-subtitle'));
    expect(meta).not.toBeNull();
    expect(meta.length).toEqual(2);
    expect(meta[0].nativeElement.innerText).toEqual('latest server update: Dec 31, 1969');
    expect(meta[1].nativeElement.innerText).toEqual('this screener has 1 questions');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons).not.toBeNull();
    expect(buttons.length).toEqual(2);
    expect(buttons[0].nativeElement.disabled).toEqual(false);
    expect(buttons[1].nativeElement.disabled).toEqual(false);
    expect(buttons[1].attributes['routerLink']).toEqual('/admin/screener/preview');
  });

  it('should show two keys in the key filter', () => {
    const autocomplete = fixture.debugElement.query(By.css('mat-autocomplete'));
    expect(autocomplete).not.toBeNull();
  });
});
