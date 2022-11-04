import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarsRoutingModule } from './cars-routing.module';
import { CarListComponent } from './car-list/car-list.component';

@NgModule({
  imports: [
    CommonModule,
    CarsRoutingModule
  ],
  declarations: [CarListComponent]
})
export class CarsModule { }