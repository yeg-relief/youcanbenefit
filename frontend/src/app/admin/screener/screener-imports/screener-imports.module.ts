/*
  intended to import and export YcbQuestion and YcbConditionalQuestion
  had some issues and resorted to importing and exporting masterScreenerModule
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterScreenerModule } from '../../../user/master-screener/master-screener.module'

@NgModule({
  imports: [
    CommonModule,
    MasterScreenerModule
  ],
  exports: [
    MasterScreenerModule
  ]
})
export class ScreenerImportsModule { }
