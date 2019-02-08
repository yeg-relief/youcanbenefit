import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { LoginComponent } from './core/login/login.component';
import { ProgramsComponent } from './programs/programs.component';
import { ProgramOverviewComponent } from './programs/program-overview/program-overview.component';
import { ProgramEditComponent } from './programs/program-edit/program-edit.component';
import { ScreenerContainerComponent } from './screener/screener-container/screener-container.component';
import { ScreenerOverviewComponent } from './screener/screener-overview/screener-overview.component'
import { ScreenerPreviewComponent } from './screener/screener-preview/screener-preview.component';
import { ApplicationEditComponent } from './programs/application-edit/application-edit.component'
import {DataComponent} from "./data/data.component";

export const routing: ModuleWithProviders = RouterModule.forChild([
    {
        path: '', component: AdminComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: 'screener',
                component: ScreenerContainerComponent,
                children: [
                    {
                        path: 'edit',
                        component: ScreenerOverviewComponent,
                    },
                    {
                        path: 'preview',
                        component: ScreenerPreviewComponent,
                    },
                ]
            },
            {
                path: 'programs',
                component: ProgramsComponent,
                children: [
                    {
                        path: 'overview',
                        component: ProgramOverviewComponent,
                    },
                    {
                        path: 'application-edit/:guid',
                        component: ApplicationEditComponent
                    },
                    {
                        path: 'edit/:guid',
                        component: ProgramEditComponent,
                    },
                    {
                        path: '', pathMatch: 'full', redirectTo: 'overview'
                    },
                ]
            },
            {
                path: 'data',
                component: DataComponent
            }

        ]
    },
    { path: 'login', component: LoginComponent },
]);
