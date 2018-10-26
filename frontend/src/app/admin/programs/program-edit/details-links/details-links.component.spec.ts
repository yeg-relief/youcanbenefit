import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsLinksComponent } from './details-links.component';

describe('DetailsLinksComponent', () => {
  let component: DetailsLinksComponent;
  let fixture: ComponentFixture<DetailsLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
