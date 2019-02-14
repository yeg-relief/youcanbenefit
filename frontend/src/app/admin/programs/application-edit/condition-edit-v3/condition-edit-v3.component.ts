import { Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { Question } from '../../../models/question';
import { ProgramConditionClass } from '../../services/program-condition.class';
import { ProgramModelService } from '../../services/program-model.service'
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators'

@Component({
  selector: 'app-condition-edit-v3',
  templateUrl: './condition-edit-v3.component.html',
  styleUrls: ['./condition-edit-v3.component.css']
})
export class ConditionEditV3Component implements OnInit, OnDestroy {
  @Input() condition: ProgramConditionClass;
  @Output() remove = new EventEmitter();
  valueWatcherNumber: Subscription;
  valueWatcherBoolean: Subscription;
  questions: Observable<Question[]>;
  keyNameClasses = { 'ng-invalid': false };
  optional = {
    boolean: false,
    number: false,
  };
  readonly qualifiers = [
    { display: '>', value: 'greaterThan' },
    { display: '>=', value: 'greaterThanOrEqual'},
    { display: '=', value: 'equal' },
    { display: '<=', value: 'lessThanOrEqual' },
    { display: '<', value: 'lessThan' },
  ];


  constructor(private ps: ProgramModelService) { }

  ngOnInit() {
    this.questions = this.ps.questions.pipe(map((questions: any[]) => questions.sort( (a, b) => a.text.localeCompare(b.text)) ));
  }

  ngOnDestroy() {
    if (this.valueWatcherNumber && !this.valueWatcherNumber.closed) this.valueWatcherNumber.unsubscribe();

    if (this.valueWatcherBoolean && !this.valueWatcherBoolean.closed) this.valueWatcherBoolean.unsubscribe();
  }


  isQuestionSelected = (option: any): boolean => {
    return option && option.id === this._getSelectedQuestionId();
  }

  private _getSelectedQuestionId(): string {
    return this.condition.form.value.question.id;
  }

  handleQuestionChange($event) {
    const booleanValueStrategy = form => {
      form.get('value').setValue(true);
      this.optional.boolean = true;
      this.optional.number = false;
    };

    const numberValueStrategy = form => {
      form.get('value').setValue(0);
      form.get('qualifier').setValue('lessThanOrEqual');
      this.optional.boolean = false;
      this.optional.number = true;
    };

    const text = $event.value.text;
    this.questions
      .pipe(take(1), map(questions => questions.find(q => q.text === text)))
      .subscribe(question => {
        if (question){
          this.condition.form.get('question').setValue(question);
          this.condition.form.get('type').setValue(question.type);

          if (question.type === 'boolean')
            booleanValueStrategy(this.condition.form);
          else 
            numberValueStrategy(this.condition.form);

          setTimeout(() => {
            if (this.condition.form.getError('invalid_key') !== null) {
              this.keyNameClasses['ng-invalid'] = true;
            } else {
              this.keyNameClasses['ng-invalid'] = false;
            }
          }, 0);
        }
      });
  }

  getQuestionType = (): string => {
    return this.condition.form.value.question.type;
  }

  isQualifierSelected = (qualifierValue: any) => {
    return this.getQuestionType() !== 'boolean' && this.condition.form.get('qualifier').value === qualifierValue;
  }

  deleteCondition() {
    this.remove.emit(this.condition)
  }

}
