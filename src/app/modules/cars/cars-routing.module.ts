import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CarDetailComponent} from './car-detail/car-detail.component';
import {CarListComponent} from './car-list/car-list.component';
import {CarDetailFormComponent} from "./car-detail-form/car-detail-form.component";

const routes: Routes = [
  {path: '', component: CarListComponent},
  {path: 'detail/new', component: CarDetailFormComponent},
  {path: 'detail/edit', component: CarDetailFormComponent},
  {path: 'detail/:id', component: CarDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarsRoutingModule {
}
