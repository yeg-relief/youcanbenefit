import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ApplicationFacingProgram } from '../../../models/program';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent implements OnInit {
  @Input() program: ApplicationFacingProgram;
  @Output() delete = new EventEmitter<string>();
  @Output() details = new EventEmitter<string>();
  selectedView: string;

  constructor(public dialog: MdDialog) { }

  ngOnInit() {}

  detailView(guid: string) {
    this.details.emit(guid);
  }
}
