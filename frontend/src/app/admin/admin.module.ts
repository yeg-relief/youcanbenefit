import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { routing } from './admin.routes';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { AdminCoreModule } from './core/admin-core.module';
import { ProgramsModule } from './programs/programs.module';
import { HttpModule } from '@angular/http';
import { ScreenerOverviewComponent } from './screener/screener-overview/screener-overview.component';
import { ScreenerToolbarComponent } from './screener/screener-toolbar/screener-toolbar.component';
import { ScreenerEffects } from './screener/store/screener-effects';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuestionListComponent } from './screener/question-list/question-list.component';
import { QuestionEditComponent } from './screener/question-edit/question-edit.component';
import { DragDropManagerService } from './screener/question-list/drag-drop-manager.service';
import { ScreenerPreviewComponent } from './screener/screener-preview/screener-preview.component';
import { ScreenerContainerComponent } from './screener/screener-container/screener-container.component';
import { ScreenerImportsModule } from './screener/screener-imports/screener-imports.module';
import { QuestionEditErrorComponent } from './screener/question-edit/question-edit-error/question-edit-error.component';
import { MultSelectQuestionsComponent } from './screener/question-edit/mult-select-questions/mult-select-questions.component';
import { OptionsComponent } from './screener/question-edit/mult-select-questions/options/options.component';
import { UserFacingProgramModule } from '../shared/modules/user-facing-program.module';
import { DataComponent } from './data/data.component';
import { DataManagementService } from "./data/data-management.service";
import {
    MatCardModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatChipsModule,
    MatButtonModule
} from "@angular/material"


@NgModule({
    imports: [
        MatCardModule,
        MatAutocompleteModule,
        MatInputModule,
        MatDividerModule,
        MatListModule,
        MatIconModule,
        MatCheckboxModule,
        MatSelectModule,
        MatChipsModule,
        MatButtonModule,
        CommonModule,
        routing,
        StoreModule.forRoot({root: reducer}),
        EffectsModule.forRoot([ScreenerEffects]),
        AdminCoreModule,
        ProgramsModule,
        ReactiveFormsModule,
        FormsModule,
        ScreenerImportsModule,
        UserFacingProgramModule
    ],
    declarations: [
        AdminComponent,
        ScreenerOverviewComponent,
        ScreenerToolbarComponent,
        QuestionListComponent,
        QuestionEditComponent,
        ScreenerPreviewComponent,
        ScreenerContainerComponent,
        QuestionEditErrorComponent,
        MultSelectQuestionsComponent,
        OptionsComponent,
        DataComponent,
    ],
    providers: [
        HttpModule,
        DragDropManagerService,
        DataManagementService
    ]
})
export class AdminModule { }
