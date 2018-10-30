import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramRowComponent } from './program-row.component';

describe('ProgramRowComponent', () => {
  let component: ProgramRowComponent;
  let fixture: ComponentFixture<ProgramRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
