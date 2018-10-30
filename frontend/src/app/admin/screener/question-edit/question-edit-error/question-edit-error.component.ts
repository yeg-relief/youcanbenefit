import { Component, OnInit, Input } from '@angular/core';
import { Animations } from '../../../../shared/animations'
@Component({
  selector: 'app-question-edit-error',
  templateUrl: './question-edit-error.component.html',
  styleUrls: ['./question-edit-error.component.css'],
  animations: [
    Animations.flyinHalf
  ]
})
export class QuestionEditErrorComponent implements OnInit {
  @Input() error: string;

  constructor() { }

  ngOnInit() {
  }

}
