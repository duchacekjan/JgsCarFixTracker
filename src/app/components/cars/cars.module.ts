import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarsRoutingModule } from './cars-routing.module';
import { CarListComponent } from './car-list/car-list.component';
import { CarDetailComponent } from './car-detail/car-detail.component';
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        CarsRoutingModule,
        FormsModule
    ],
  declarations: [CarListComponent, CarDetailComponent]
})
export class CarsModule { }
