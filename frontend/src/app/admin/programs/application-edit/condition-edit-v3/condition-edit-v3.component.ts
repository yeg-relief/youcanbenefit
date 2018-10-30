import { Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { Key } from '../../../models/key'
import { ProgramConditionClass } from '../../services/program-condition.class';
import { ProgramModelService } from '../../services/program-model.service'
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import "rxjs/add/operator/do"

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
  keys: Observable<Key[]>;
  keyNameClasses = {
    'ng-invalid': false
  };
  optional = {
    boolean: false,
    number: false,
  };
  readonly qualifiers = [
    {
      display: '>', value: 'greaterThan'
    },
    {
      display: '>=', value: 'greaterThanOrEqual'
    },
    {
      display: '=', value: 'equal'
    },
    {
      display: '<=', value: 'lessThanOrEqual'
    },
    {
      display: '<', value: 'lessThan'
    },
  ];


  constructor(private ps: ProgramModelService) { }

  ngOnInit() {


    this.keys = this.ps.keys.asObservable().map(keys => keys.sort( (a, b) => a.name.localeCompare(b.name)) );
  }

  ngOnDestroy() {
    if (this.valueWatcherNumber && !this.valueWatcherNumber.closed) this.valueWatcherNumber.unsubscribe();

    if (this.valueWatcherBoolean && !this.valueWatcherBoolean.closed) this.valueWatcherBoolean.unsubscribe();
  }


  isKeySelected(name: string): boolean {
    return name === this._getSelectedKeyName();
  }

  private _getSelectedKeyName(): string {
    return this.condition.form.value.key.name;
  }

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

    const name = $event.target.value;
    this.keys.take(1).map(keys => keys.find(k => k.name === name)).subscribe(key => {
      if (key){
        this.condition.form.get('key').setValue(key);
        this.condition.form.get('type').setValue(key.type);

        if (key.type === 'boolean')
          booleanValueStrategy(this.condition.form);
        else 
          numberValueStrategy(this.condition.form);

        setTimeout(() => {
          if (this.condition.form.getError('invalid_key') !== null) {
            this.keyNameClasses['ng-invalid'] = true;
          } else {
            this.keyNameClasses['ng-invalid'] = false;
          }
        }, 10);
      }
    });
  }

  getKeyType(): string {
    return this.condition.form.value.key.type;
  }

  isQualifierSelected(qualifierValue: string) {
    return this.getKeyType() !== 'boolean' &&
        this.condition.form.get('qualifier').value === qualifierValue;
  }

  deleteCondition() {
    this.remove.emit(this.condition)
  }

}
