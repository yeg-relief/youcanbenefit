import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeysComponent } from './keys.component';
import { KeysOverviewComponent } from './overview/overview.component';
import { RouterModule } from '@angular/router';
import { MatCardModule, MatButtonModule, MatCheckboxModule, MatInputModule } from '@angular/material';
import { KeyEditComponent } from './edit/key-edit.component';
import { KeyOverviewControlsComponent } from './overview/key-overview-controls/key-overview-controls.component';
import { AdminCoreModule } from '../core/admin-core.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    AdminCoreModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule
  ],
  declarations: [
    KeysComponent,
    KeysOverviewComponent,
    KeyEditComponent,
    KeyOverviewControlsComponent
  ],
  providers: []
})
export class KeysModule { }
