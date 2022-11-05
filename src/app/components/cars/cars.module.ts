import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarsRoutingModule } from './cars-routing.module';
import { CarListComponent } from './car-list/car-list.component';
import { CarDetailComponent } from './car-detail/car-detail.component';

@NgModule({
  imports: [
    CommonModule,
    CarsRoutingModule
  ],
  declarations: [CarListComponent, CarDetailComponent]
})
export class CarsModule { }