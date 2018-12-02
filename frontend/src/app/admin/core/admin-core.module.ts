import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule, MatInputModule, MatProgressBarModule } from '@angular/material';
import { LoginComponent } from './login/login.component';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatProgressBarModule
  ],
  declarations: [
    LoginComponent,
    BreadCrumbComponent,
  ],
  exports: [
    LoginComponent,
    BreadCrumbComponent
  ]
})
export class AdminCoreModule {};
