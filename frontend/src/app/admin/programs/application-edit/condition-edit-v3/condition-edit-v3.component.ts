import { Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { QuestionKey } from '../../../models/question-key'
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
  questionKeys: Observable<QuestionKey[]>;
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
    this.questionKeys = this.ps.questionKeys.pipe(map((questionKeys: any[]) => questionKeys.sort( (a, b) => a.text.localeCompare(b.text)) ));
  }

  ngOnDestroy() {
    if (this.valueWatcherNumber && !this.valueWatcherNumber.closed) this.valueWatcherNumber.unsubscribe();

    if (this.valueWatcherBoolean && !this.valueWatcherBoolean.closed) this.valueWatcherBoolean.unsubscribe();
  }


  isQuestionKeySelected(option: any): boolean {
    return option && option.id === this._getSelectedQuestionKeyId();
  }

  private _getSelectedQuestionKeyId(): string {
    return this.condition.form.value.questionKey.id;
  }

  // isKeySelected = (option: any): boolean => {
  //   return option && option.name === this._getSelectedQuestionKeyId();
  // };



  handleKeyChange($event) {
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

    // const text = $event.target.value;
    // this.questionKeys
    //   .pipe(take(1), map(keys => keys.find(k => k.text === text)))
    //   .subscribe(questionKey => {
    //     if (questionKey){
    //       this.condition.form.get('questionKey').setValue(questionKey);
    //       this.condition.form.get('type').setValue(questionKey.type);
    const text = $event.value.text;
    this.questionKeys
      .pipe(take(1), map(keys => keys.find(k => k.text === text)))
      .subscribe(questionKey => {
        if (questionKey){
          this.condition.form.get('questionKey').setValue(questionKey);
          this.condition.form.get('type').setValue(questionKey.type);

          if (questionKey.type === 'boolean')
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

  getQuestionKeyType = (): string => {
    return this.condition.form.value.questionKey.type;
  }

  isQualifierSelected = (qualifierValue: any) => {
    return this.getQuestionKeyType() !== 'boolean' && this.condition.form.get('qualifier').value === qualifierValue;
  }

  deleteCondition() {
    this.remove.emit(this.condition)
  }

}
