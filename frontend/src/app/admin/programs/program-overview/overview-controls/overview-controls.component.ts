import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Animations } from '../../../../shared/animations';
import { FilterService } from '../services/filter.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-overview-controls',
  templateUrl: './overview-controls.component.html',
  styleUrls: ['./overview-controls.component.css'],
  animations: [
    Animations.fadeinAndOut
  ]
})
export class OverviewControlsComponent implements OnInit, OnDestroy {
  @Input() loaded: boolean;
  @Input() deleteInitiated: boolean;
  form: FormGroup;
  styleIcon$: Observable<any>;
  disableInput: Subscription;
  ENTER_KEY = 13;
  constructor(private filterService: FilterService) { }

  ngOnInit() {
    this.form = this.filterService.form;

    const formChanges = this.form.valueChanges
      .debounceTime(100)
      .distinctUntilChanged()
      .map(value => value.type !== undefined && value.type !== '' && value.type !== 'none')
      .shareReplay()

    this.styleIcon$ = formChanges
      .let(this.updateFilterDisplay.bind(this))
      .startWith({
        'filter_active': false,
        'filter_inactive': true  
      });

    this.disableInput = formChanges.subscribe(val => this.filterService.effectInput(val))
  }

  ngOnDestroy(){
    if (this.disableInput && !this.disableInput.closed)
      this.disableInput.unsubscribe();
  }

  blurOnEnter($keyupEvent) {
    if($keyupEvent.keyCode === this.ENTER_KEY) {
      $keyupEvent.target.blur();
    }
  }

  updateFilterDisplay(input$: Observable<boolean>): Observable<any>{
    return input$.map(showFilter => {
      if (showFilter) 
        return {
          filter_active: true,
          filter_inactive: false
        }
      
      return {
        filter_active: false,
        filter_inactive: true
      }
      
    })
  }
}
