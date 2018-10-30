import { Component } from '@angular/core';
import { ProgramModelService } from './services/program-model.service'

@Component({
  template: '<router-outlet></router-outlet>',
  styles: [`
    :host {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
  `],
  providers: [
    ProgramModelService
  ]
})
export class ProgramsComponent  {

  constructor(public model: ProgramModelService) { }
}
