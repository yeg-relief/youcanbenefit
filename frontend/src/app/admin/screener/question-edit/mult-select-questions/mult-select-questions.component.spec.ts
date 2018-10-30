import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultSelectQuestionsComponent } from './mult-select-questions.component';

describe('MultSelectQuestionsComponent', () => {
  let component: MultSelectQuestionsComponent;
  let fixture: ComponentFixture<MultSelectQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultSelectQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultSelectQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
