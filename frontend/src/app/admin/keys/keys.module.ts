import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeysComponent } from './keys.component';
import { KeysOverviewComponent } from './overview/overview.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { KeyEditComponent } from './edit/key-edit.component';
import { KeyOverviewControlsComponent } from './overview/key-overview-controls/key-overview-controls.component';
import { AdminCoreModule } from '../core/admin-core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KeyResolverService } from './overview/key-resolver.service';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    AdminCoreModule,
    MaterialModule,
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
