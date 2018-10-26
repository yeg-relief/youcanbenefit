import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTagContainerComponent } from './list-tag-container.component';

describe('ListTagContainerComponent', () => {
  let component: ListTagContainerComponent;
  let fixture: ComponentFixture<ListTagContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTagContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTagContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
