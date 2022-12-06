import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CarListComponent} from './car-list/car-list.component';
import {MaterialModule} from "../../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {CarsRoutingModule} from "./cars-routing.module";
import {CarDetailFormComponent} from './car-detail-form/car-detail-form.component';
import {CarDetailFormResolver} from "./car-detail-form/car-detail-form.resolver";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CarsRoutingModule
  ],
  declarations: [
    CarListComponent,
    CarDetailFormComponent
  ],
  providers:[
    CarDetailFormResolver
  ]
})

export class CarsModule {
}
