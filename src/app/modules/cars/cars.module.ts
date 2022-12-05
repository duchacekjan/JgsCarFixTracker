import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import { CarListComponent } from './car-list/car-list.component';
import {MaterialModule} from "../../material.module";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {CarsRoutingModule} from "./cars-routing.module";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    TranslateModule,
    CarsRoutingModule
  ],
  declarations: [
    CarListComponent
  ]
})

export class CarsModule {
}
