import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-ycb-conditional-question',
  templateUrl: './ycb-conditional-question.component.html',
  styleUrls: ['./ycb-conditional-question.component.css']
})
export class YcbConditionalQuestionComponent implements OnInit {
  @Input() question: any;
  @Input() form: FormGroup;

  constructor() { }

  ngOnInit() {
    console.warn(`YcbConditionalQuestionComponent is deprecated replace with YcbQuestionComponent`);
  }

}
