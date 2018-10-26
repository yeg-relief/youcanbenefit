import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/services/auth.service';
import * as fromRoot from '../../reducer';
import * as actions  from '../store/screener-actions';

@Component({
  selector: 'app-screener-container',
  templateUrl: './screener-container.component.html',
  styleUrls: ['./screener-container.component.css']
})
export class ScreenerContainerComponent implements OnInit {

  constructor(
    private store: Store<fromRoot.State>, 
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.store.dispatch(new actions.LoadData(this.auth.getCredentials()));
  }

}
