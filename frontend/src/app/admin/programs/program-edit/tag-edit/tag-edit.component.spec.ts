import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagEditComponent } from './tag-edit.component';

describe('TagEditComponent', () => {
  let component: TagEditComponent;
  let fixture: ComponentFixture<TagEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
