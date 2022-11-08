import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarsRoutingModule } from './cars-routing.module';
import { CarListComponent } from './car-list/car-list.component';
import { CarDetailComponent } from './car-detail/car-detail.component';
import {FormsModule} from "@angular/forms";
import { CarListItemComponent } from './car-list-item/car-list-item.component';
import { CarFixListComponent } from './car-fix-list/car-fix-list.component';

@NgModule({
    imports: [
        CommonModule,
        CarsRoutingModule,
        FormsModule
    ],
  declarations: [CarListComponent, CarDetailComponent, CarListItemComponent, CarFixListComponent]
})
export class CarsModule { }
