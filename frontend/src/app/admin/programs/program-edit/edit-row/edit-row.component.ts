import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-edit-row',
  styles: [`
      .edit-row-section {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .edit-row-section > mat-icon {
        width: 10%;
      }
  `

  ],
  template: `
    <section class="edit-row-section">
      <mat-icon [matTooltip]="tooltip">{{icon}}</mat-icon>
      <ng-content class="flex-grow"></ng-content>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditRowComponent implements OnInit {
  @Input() icon: string;
  @Input() tooltip: string;
  constructor() { }

  ngOnInit() {
  }

}
