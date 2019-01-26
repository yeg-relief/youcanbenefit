import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ApplicationFacingProgram } from '../../../models/program';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent {
  @Input() program: ApplicationFacingProgram;
  @Output() delete = new EventEmitter<string>();
  @Output() details = new EventEmitter<string>();
  selectedView: string;

  detailView(guid: string) {
    this.details.emit(guid);
  }
}
