import { TestBed, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DragDropManagerService } from './drag-drop-manager.service';

describe('DragDropManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DragDropManagerService, FormBuilder]
    });
    
  });

  it('should be constructed with blank lifted and target dragstate', 
    inject([DragDropManagerService], (service: DragDropManagerService) => {
      const sub = service.dragState.subscribe(dragstate => {
        expect(dragstate.lifted).toEqual('');
        expect(dragstate.target).toEqual('');
      });
      sub.unsubscribe();    
  }));

  it('will not lift an invalid id', 
    inject([DragDropManagerService], (service: DragDropManagerService) => {
      let sub = service.dragState
        .do( _ => service.liftItem(''))
        .subscribe(dragstate => {
          expect(dragstate.lifted).toEqual('');
          expect(dragstate.target).toEqual('');
      });
      sub.unsubscribe();

      sub = service.dragState
        .do( _ => service.liftItem(undefined))
        .subscribe(dragstate => {
          expect(dragstate.lifted).toEqual('');
          expect(dragstate.target).toEqual('');
      });
      sub.unsubscribe();
  }));

  it('will lift an id if target is blank', 
    inject([DragDropManagerService], (service: DragDropManagerService) => {
      let sub = service.dragState
        .do( _ => service.liftItem('fake-id'))
        .subscribe(dragstate => {
          expect(dragstate.lifted).toEqual('fake-id');
          expect(dragstate.target).toEqual('');
      });
      sub.unsubscribe();
  }));

  it('will not set a target with an blank id', 
    inject([DragDropManagerService], (service: DragDropManagerService) => {
      let sub = service.dragState
        .do( _ => service.liftItem('fake-id'))
        .do( _ => service.dropItem(''))
        .subscribe(dragstate => {
          expect(dragstate.lifted).toEqual('fake-id');
          expect(dragstate.target).toEqual('');
      });
      sub.unsubscribe();
  }));

  it('will not set a target with an undefined id', 
    inject([DragDropManagerService], (service: DragDropManagerService) => {
      let sub = service.dragState
        .do( _ => service.liftItem('fake-id'))
        .do( _ => service.dropItem(undefined))
        .subscribe(dragstate => {
          expect(dragstate.lifted).toEqual('fake-id');
          expect(dragstate.target).toEqual('');
      });
      sub.unsubscribe();
  }));
  
  it('is used to set a target when an item is properly lifted', 
    inject([DragDropManagerService], (service: DragDropManagerService) => {
      let sub = service.dragState
        .do( _ => service.liftItem('fake-id'))
        .do( _ => service.dropItem('fake-id-2'))
        .subscribe(dragstate => {
          expect(dragstate.lifted).toEqual('fake-id');
          expect(dragstate.target).toEqual('fake-id-2');
      });
      sub.unsubscribe();
  }));
});
