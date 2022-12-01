import {NgModule} from '@angular/core';
import {DialogModule} from '@angular/cdk/dialog';
import {MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";

@NgModule({
  exports: [
    DialogModule,
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {panelClass: 'mat-dialog-override'}}]
})
export class MaterialModule {
}
