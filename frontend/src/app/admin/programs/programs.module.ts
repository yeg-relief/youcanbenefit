import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramsComponent } from './programs.component';
import { ProgramOverviewComponent } from './program-overview/program-overview.component';
import { RouterModule } from '@angular/router';
import { 
  MatSnackBarModule, 
  MatProgressSpinnerModule, 
  MatCardModule, 
  MatIconModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatChipsModule,
  MatTooltipModule, 
  MatInputModule,
  MatButtonModule,
  MatTabsModule,
  MatListModule
} from '@angular/material';
import { AdminCoreModule } from '../core/admin-core.module';
import { ProgramDetailComponent } from './program-overview/program-detail/program-detail.component';
import { OverviewControlsComponent } from './program-overview/overview-controls/overview-controls.component';
import { ProgramEditComponent } from './program-edit/program-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QueryDisplayComponent } from './application-edit/query-display/query-display.component';
import { ApplicationEditComponent } from './application-edit/application-edit.component';
import { ProgramModelService } from './services/program-model.service';
import { QueryEditV3Component } from './application-edit/query-edit-v3/query-edit-v3.component';
import { ConditionEditV3Component } from './application-edit/condition-edit-v3/condition-edit-v3.component';
import { QueryService } from './services/query.service';
import { TagEditComponent } from './program-edit/tag-edit/tag-edit.component';
import { EditRowComponent } from './program-edit/edit-row/edit-row.component';
import { DetailsLinksComponent } from './program-edit/details-links/details-links.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    ReactiveFormsModule,
    AdminCoreModule,
    MatListModule,
  ],
  declarations: [
    ProgramsComponent,
    ProgramOverviewComponent,
    ProgramDetailComponent,
    OverviewControlsComponent,
    ProgramEditComponent,
    QueryDisplayComponent,
    ApplicationEditComponent,
    QueryEditV3Component,
    ConditionEditV3Component,
    TagEditComponent,
    EditRowComponent,
    DetailsLinksComponent
  ],
  providers: [
    ProgramModelService,
    QueryService
  ]
})
export class ProgramsModule { }
