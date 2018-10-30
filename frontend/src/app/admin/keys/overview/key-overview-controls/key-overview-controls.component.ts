import { Component, OnInit, Output, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-key-overview-controls',
  templateUrl: './key-overview-controls.component.html',
  styleUrls: ['./key-overview-controls.component.css']
})
export class KeyOverviewControlsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  sub;
  @Output() onFilter = new EventEmitter<string>();
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      filter: [false, Validators.required],
      keyName: ['']
    });

    this.sub = this.form.valueChanges
      .filter(_ => this.form.valid)
      .subscribe(values => this.onFilter.emit( values.keyName ) );
  }

  ngOnDestroy(){
    if (this.sub && !this.sub.closed) {
      this.sub.unsubscribe();
    }
  }

}

