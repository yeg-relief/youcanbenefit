import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionsComponent } from './questions/questions.component';
import { ResultsComponent } from './results/results.component';
import { UserFacingProgramModule } from '../../shared/modules/user-facing-program.module';
import { MasterScreenerComponent } from './master-screener.component';
import { HttpModule } from '@angular/http';
import { QuestionsResolverService } from './questions/questions-resolver.service';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { YcbQuestionComponent } from './ycb-question/ycb-question.component';
import { YcbConditionalQuestionComponent } from './ycb-question/ycb-conditional-question/ycb-conditional-question.component';
import { masterScreenerRouting } from './master-screener.routes';
import { ResultListComponent } from './results/result-list/result-list.component';

@NgModule({
    imports: [
        CommonModule,
        UserFacingProgramModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule,
        MaterialModule,
        masterScreenerRouting
    ],
    declarations: [
        QuestionsComponent,
        ResultsComponent,
        MasterScreenerComponent,
        YcbQuestionComponent,
        YcbConditionalQuestionComponent,
        ResultListComponent // depracated ??
    ],
    providers: [
        QuestionsResolverService
    ],
    exports: [
        YcbQuestionComponent,
        YcbConditionalQuestionComponent,
    ]
})
export class MasterScreenerModule {}
