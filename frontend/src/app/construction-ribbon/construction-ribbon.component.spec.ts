import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionRibbonComponent } from './construction-ribbon.component';

describe('ConstructionRibbonComponent', () => {
  let component: ConstructionRibbonComponent;
  let fixture: ComponentFixture<ConstructionRibbonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructionRibbonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionRibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
