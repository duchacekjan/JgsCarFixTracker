import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarsRoutingModule} from './cars-routing.module';
import {CarListComponent} from './car-list/car-list.component';
import {CarDetailComponent} from './car-detail/car-detail.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CarDetailFormComponent} from './car-detail-form/car-detail-form.component';
import {EditTableComponent} from './edit-table/edit-table.component';
import {SnackBarComponent} from './snack-bar/snack-bar.component';
import {DialogComponent} from './dialog/dialog.component';
import {MaterialModule} from "../../material.module";

@NgModule({
  imports: [
    CommonModule,
    CarsRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [CarListComponent, CarDetailComponent, CarDetailFormComponent, EditTableComponent, SnackBarComponent, DialogComponent]
})
export class CarsModule {
}
