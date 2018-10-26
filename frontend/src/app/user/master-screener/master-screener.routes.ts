import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterScreenerComponent } from "./master-screener.component";
import { QuestionsComponent } from "./questions/questions.component";
import { ResultsComponent } from "./results/results.component";
import { QuestionsResolverService } from "./questions/questions-resolver.service";
import { ProgramDetailComponent } from "../../shared/components/program/program-detail/program-detail.component";
import { ResultListComponent } from "./results/result-list/result-list.component";

const routes: Routes = [
    {
        path: 'master-screener',
        component: MasterScreenerComponent,
        children: [
            {
                path: 'questions', component: QuestionsComponent,
                resolve: {
                    questions: QuestionsResolverService
                }
            },
            {
                path: 'results',
                component: ResultsComponent,
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: ResultListComponent
                    },

                    {
                        path: 'details/:guid',
                        component: ProgramDetailComponent
                    }
                ]
            }
        ]
    }
];

export const masterScreenerRouting: ModuleWithProviders = RouterModule.forChild(routes);