import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ID, QuestionType, QUESTION_TYPE_CONDITIONAL, QUESTION_TYPE_CONSTANT } from '../../models';
import { Subject, Subscription, combineLatest } from 'rxjs';
import { takeUntil, map, filter, tap } from 'rxjs/operators'
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { DragDropManagerService, DragDatum } from './drag-drop-manager.service';

declare const document;

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css'],
})
export class QuestionListComponent implements OnInit, OnDestroy {
  @Input() questions: ID[];
  @Input() form: FormGroup;
  @Input() type: QuestionType; // are these conditional or constant questions in the list?
  @Input() host_id: ID | undefined; // undefined if these are constant questions
  @Output() questionSelect = new EventEmitter<ID>();
  @Output() questionUnselect = new EventEmitter<ID>();
  @Output() addQuestion = new EventEmitter<{[id: string]: QuestionType | ID }>();
  @Output() dragEvent =  new EventEmitter<DragDatum>();

  classes: { [id: string]: {[id: string]: boolean} } = { };
  constant_type: QuestionType = QUESTION_TYPE_CONSTANT;
  conditional_type: QuestionType = QUESTION_TYPE_CONDITIONAL;

  selectedQuestionID: any;
  destroySubs$ = new Subject();
  
  containerClasses = {
    container_over: false,

  };

  constructor(
    private store: Store<fromRoot.State>, 
    private dragManager: DragDropManagerService
  ) {}

  handleAddQuestion() {
    if (this.type === QUESTION_TYPE_CONSTANT ) {
      Promise.resolve(this.addQuestion.emit({type: QUESTION_TYPE_CONSTANT}))
        .then( () => setTimeout( () => this.selectTarget(this.questions[this.questions.length - 1]), 60))
        .then( () => {
          const id = this.questions[this.questions.length -1];
          this.showSelection(id);
        });
      return;
    } else if (this.type === QUESTION_TYPE_CONDITIONAL ) {
      Promise.resolve(this.addQuestion.emit({type: QUESTION_TYPE_CONDITIONAL, host_id: this.host_id}))
        .then( () => setTimeout( () => this.selectTarget(this.questions[this.questions.length -1]), 60))
        .then( () => {
          const id = this.questions[this.questions.length -1];
          this.showSelection(id);
        })
    } else {
      console.warn('[QuestionList]: unkown type @Input()');
    }
  } 

  handleSelect(questionID: ID) {
    
    const selected_id = Object.keys(this.classes).find(id => this.classes[id]['selected'] === true);
    if (selected_id !== undefined && selected_id === questionID) {
      this.questionUnselect.emit(selected_id);
      this.deselectAll();
      return;
    } 

    this.deselectAll();

    if (this.classes[questionID] === undefined) this.classes[questionID] = { };

    this.classes[questionID]['selected'] = true;

    
    Promise.resolve(this.questionUnselect.emit(selected_id))
           .then(_ => this.questionSelect.emit(questionID));
  }
  
  ngOnInit(){
    this.selectedQuestionID = combineLatest(
      fromRoot.getSelectedConstantID(this.store),
      fromRoot.getSelectedConditionalID(this.store)
    )
    .pipe(takeUntil(this.destroySubs$.asObservable()))
    .subscribe( ([constantID, conditionalID]: any[]) => { 
      const presentConstant = this.questions.find(qid => qid === constantID);
      const presentConditional = this.questions.find(qid => qid === conditionalID);

      if (presentConstant !== undefined) 
        this.selectTarget(constantID);
      else if(presentConditional !== undefined) 
        this.selectTarget(conditionalID);
      else 
        this.deselectAll(); 

    });
  }

  private initializeStyle(id){
    this.classes[id] = (<any>Object).assign({}, {
      selected: false,
      dragStart: false,
      dragOver: false,
      filtered_me: false
    })
  }


  showSelection(selectedID) {
    const element = document.getElementById(selectedID);
    scrollIntoView(element);
    const index = this.questions.findIndex(id => id === selectedID);
    const targetID = index >= 0 ? this.questions[index] : undefined;
    this.selectTarget(targetID);
  }

  deselectAll() {
    for (const id in this.classes) {
      if (this.classes[id]['selected'] === true) this.classes[id]['selected'] = false;
    }
  }

  selectTarget(targetID){
    this.deselectAll();

    if (targetID === undefined) return;

    if(this.classes[targetID] === undefined) this.classes[targetID] = { };

    this.classes[targetID]['selected'] = true;
  }

  ngOnDestroy() { 
    // attempt to clear the selected class that sticks after route change...
    for(const id in this.classes) delete this.classes[id];
    
    this.destroySubs$.next(); 
  }

  dragStart(id, $event) {
    if (id === this.type + '-container') return;


    if (this.classes[id]) {
      this.classes[id] = (<any>Object).assign({}, this.classes[id], { dragStart: true})
    } else {
      this.initializeStyle(id)
    }
    
    // hack to make elements draggable in firefox
    // http://mereskin.github.io/dnd/
    $event.dataTransfer.setData('text', 'foo');

    this.dragManager.liftItem(id);
  }

  dragEnter(id, $event) {
    if($event.preventDefault) {
      $event.preventDefault();
    }

    if (id === this.type + '-container') {
      this.containerClasses = {
        container_over: true
      }
    }

    if (this.classes[id]) {
      this.classes[id] = (<any>Object).assign({}, this.classes[id], { dragOver: true})
    } else {
      this.initializeStyle(id)
    }
  }

  dragOver(id, $event){
    if ($event.preventDefault) {
      $event.preventDefault();
    }

    if (id === this.type + '-container') {
      this.containerClasses = {
        container_over: true
      }
    }

    if (this.classes[id]) {
      this.classes[id] = (<any>Object).assign({}, this.classes[id], { dragOver: true})
    } else {
      this.initializeStyle(id)
    }
    return false;
  }

  dragLeave(id) {
    if (id === this.type + '-container') {
      this.containerClasses = {
        container_over: false
      }
    }



    if (this.classes[id]) {
      this.classes[id] = (<any>Object).assign({}, this.classes[id], { dragOver: false})
    } else {
      this.initializeStyle(id)
    }
  }

  drop(id, $event) {


    if($event.preventDefault){
      $event.preventDefault();
    }

    if($event.stopPropagation) {
      $event.stopPropagation();
    }    

    if (id === this.type + '-container') {
      this.containerClasses = {
        container_over: false
      }
    }
    // there is a function to abstract
    let targetNode = $event.target;
    let targetClassNames = $event.target.className.split(" ");
    let i = 0;
    while(targetClassNames.find(name => name === 'question-item') === undefined) {
      if (targetNode.parentNode !== null && targetNode.parentNode !== undefined) {
        targetNode = targetNode.parentNode;
        targetClassNames = targetNode.className.split(" ");
      }
      
      i++;
      if (i > 5) break;
    }
    // dropped into another question
    if (Array.isArray(targetNode.id.split('-')) && 
        targetNode.id.split('-').length > 0 &&
        typeof targetNode.id.split('-')[0] === 'string'
        && targetNode.id.split('-')[0] !== 'constant-question-list'
        && targetNode.id.split('-')[0] !== 'conditional-question-list'
        && targetNode.id.split('-')[0] !== '')
    {

      this.dragManager.dropItem( targetNode.id.split('-')[0] );

      for (const id in this.classes) {
        this.classes[id]['dragStart'] = false;
        this.classes[id]['dragOver'] = false;
      }
      
      
      return false;
    }
    // probably a container
    targetNode = $event.target;
    let targetID = $event.target.id;
    i = 0;
    while(targetID !== (this.type + '_container') ) {
      if (++i > 5) break;

      targetID = targetNode.parentNode.id;
    }

    if (targetID === this.type + '_container') {
      this.dragManager.dropItem( targetID );
    }

    for (const id in this.classes) {
        this.classes[id]['dragStart'] = false;
        this.classes[id]['dragOver'] = false;
      }
      
      
    return false;


    
  }

  dragEnd() {
    for(const id in this.classes) {
      this.classes[id]['dragOver'] = false;
      this.classes[id]['dragStart'] = false;
    }
    this.containerClasses = {
      container_over: false
    }
  }
}



function scrollIntoView(element){
  if (element) element.scrollIntoView({block: "start", behavior: "smooth"});
}