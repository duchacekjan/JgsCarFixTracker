import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarsRoutingModule} from './cars-routing.module';
import {CarListComponent} from './car-list/car-list.component';
import {CarDetailComponent} from './car-detail/car-detail.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CarListItemComponent} from './car-list-item/car-list-item.component';
import {CarFixListComponent} from './car-fix-list/car-fix-list.component';
import {CarFixItemComponent} from './car-fix-item/car-fix-item.component';
import {IconButtonComponent} from './icon-button/icon-button.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import { CarDetailFormComponent } from './car-detail-form/car-detail-form.component';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  imports: [
    CommonModule,
    CarsRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  declarations: [CarListComponent, CarDetailComponent, CarListItemComponent, CarFixListComponent, CarFixItemComponent, IconButtonComponent, CarDetailFormComponent]
})
export class CarsModule {
}
