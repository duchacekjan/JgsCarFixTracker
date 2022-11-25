import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarsRoutingModule} from './cars-routing.module';
import {CarListComponent} from './car-list/car-list.component';
import {CarDetailComponent} from './car-detail/car-detail.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CarDetailFormComponent} from './car-detail-form/car-detail-form.component';
import {EditTableComponent} from './edit-table/edit-table.component';
import {MaterialModule} from "../../material.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    CarsRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [CarListComponent, CarDetailComponent, CarDetailFormComponent, EditTableComponent]
})
export class CarsModule {
}
