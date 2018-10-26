import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IeSucksComponent } from './ie-sucks.component';

describe('IeSucksComponent', () => {
  let component: IeSucksComponent;
  let fixture: ComponentFixture<IeSucksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IeSucksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IeSucksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
