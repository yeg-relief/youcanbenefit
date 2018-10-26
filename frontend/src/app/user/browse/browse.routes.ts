import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowseComponent } from "./browse.component";
import { CategoryComponent } from "./category/category.component";
import { CategoryListComponent } from "./category/category-list/category-list.component";
import { ProgramDetailComponent } from "../../shared/components/program/program-detail/program-detail.component";

const routes: Routes = [
    {
        path: 'browse-programs', component: BrowseComponent,
        children: [
            {
                path: ':category',
                component: CategoryComponent,
                children: [
                    {
                        path: '',
                        component: CategoryListComponent,
                        pathMatch: 'full'
                    },
                    {
                        path: 'details/:guid',
                        component: ProgramDetailComponent
                    }
                ]
            }
        ],
    },
];

export const browseRouting: ModuleWithProviders = RouterModule.forChild(routes);