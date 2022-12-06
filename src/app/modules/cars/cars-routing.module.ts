import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CarListComponent} from './car-list/car-list.component';
import {CarDetailFormComponent} from "./car-detail-form/car-detail-form.component";
import {CarDetailFormResolver} from "./car-detail-form/car-detail-form.resolver";

const routes: Routes = [
  {path: '', component: CarListComponent},
  {path: 'detail/new', component: CarDetailFormComponent, resolve:{'car':CarDetailFormResolver}},
  {path: 'detail/edit', component: CarDetailFormComponent, resolve:{'car':CarDetailFormResolver}},
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarsRoutingModule {
}
