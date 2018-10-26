import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickLinksContentComponent } from './quick-links-content.component';

describe('QuickLinksContentComponent', () => {
  let component: QuickLinksContentComponent;
  let fixture: ComponentFixture<QuickLinksContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickLinksContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickLinksContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
