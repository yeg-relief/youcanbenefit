import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Animations } from '../../../../shared/animations';
import { FilterService } from '../services/filter.service';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap, shareReplay, startWith } from 'rxjs/operators'

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
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        map(value => value.type !== undefined && value.type !== '' && value.type !== 'none'),
        shareReplay()
      )

      

    this.styleIcon$ = formChanges
        .pipe(
          this.updateFilterDisplay.bind(this),
          startWith({
            'filter_active': false,
            'filter_inactive': true  
          })
        )

    this.disableInput = formChanges.subscribe(this.filterService.effectInput)
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
    return input$
      .pipe(
        map(showFilter => (
           showFilter ? ({filter_active: true, filter_inactive: false}) : ({ filter_active: false, filter_inactive: true })          
        ))
      )
  }
}
