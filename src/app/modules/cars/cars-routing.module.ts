import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CarListComponent} from './car-list/car-list.component';
import {CarDetailFormComponent} from "./car-detail-form/car-detail-form.component";
import {CarDetailFormBackLinkResolver, CarDetailFormCarResolver, CarDetailFormIsNewResolver} from "./car-detail-form/car-detail-form.resolver";
import {CarDetailComponent} from "./car-detail/car-detail.component";
import {CarDetailActionResolver, CarDetailCarResolver} from "./car-detail/car-detail.resolver";

const routes: Routes = [
  {path: '', component: CarListComponent},
  {
    path: 'detail/new', component: CarDetailFormComponent, resolve: {
      'back-link': CarDetailFormBackLinkResolver,
      'car': CarDetailFormCarResolver,
      'is-new': CarDetailFormIsNewResolver
    }
  },
  {
    path: 'detail/edit', component: CarDetailFormComponent, resolve: {
      'back-link': CarDetailFormBackLinkResolver,
      'car': CarDetailFormCarResolver,
      'is-new': CarDetailFormIsNewResolver
    }
  },
  {path: 'detail/:id', component: CarDetailComponent, resolve: {'car': CarDetailCarResolver}},
  {path: 'detail/:id/:action', component: CarDetailComponent, resolve: {'car': CarDetailCarResolver, 'action':CarDetailActionResolver}},
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarsRoutingModule {
}
