import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CarListComponent} from './car-list/car-list.component';
import {MaterialModule} from "../../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {CarsRoutingModule} from "./cars-routing.module";
import {CarDetailFormComponent} from './car-detail-form/car-detail-form.component';
import {CarDetailFormCarResolver, CarDetailFormIsNewResolver} from "./car-detail-form/car-detail-form.resolver";
import {CarDetailComponent} from './car-detail/car-detail.component';
import {CarDetailActionResolver, CarDetailCarResolver} from "./car-detail/car-detail.resolver";
import {EditTableComponent} from "./edit-table/edit-table.component";

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
    CarDetailFormComponent,
    CarDetailComponent,
    EditTableComponent
  ],
  providers: [
    CarDetailFormCarResolver,
    CarDetailFormIsNewResolver,
    CarDetailCarResolver,
    CarDetailActionResolver
  ]
})

export class CarsModule {
}
