import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { BrowseComponent } from './browse.component';
import { CategoryComponent } from './category/category.component';
import { UserFacingProgramModule } from '../../shared/modules/user-facing-program.module';
import { MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { browseRouting } from "./browse.routes";
import { CategoryListComponent } from './category/category-list/category-list.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpModule,
        UserFacingProgramModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        browseRouting
    ],
    declarations: [
        BrowseComponent,
        CategoryComponent,
        CategoryListComponent
    ],
    providers: [

    ]
})
export class BrowseModule { }
