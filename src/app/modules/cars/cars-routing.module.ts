import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CarListComponent} from './car-list/car-list.component';
import {CarDetailFormComponent} from "./car-detail-form/car-detail-form.component";
import {CarDetailComponent} from "./car-detail/car-detail.component";
import {BackLinkResolver} from "../../common/resolvers/back-link.resolver";
import {CarDetailResolver} from "../../common/resolvers/car-detail.resolver";

const routes: Routes = [
  {path: '', component: CarListComponent, title: 'cars.list.title'},
  {path: 'new', component: CarDetailFormComponent, resolve: {'back-link': BackLinkResolver, 'car': CarDetailResolver}, data: {'is-new': true}, title: 'cars.detail.new.title'},
  {path: ':id', component: CarDetailComponent, resolve: {'car': CarDetailResolver}, data: {'back-link': '/cars'}, title: 'cars.detail.title'},
  {path: ':id/edit', component: CarDetailFormComponent, resolve: {'back-link': BackLinkResolver, 'car': CarDetailResolver}, data: {'is-new': false}, title: 'cars.detail.title'},
  {path: ':id/delete', component: CarDetailComponent, resolve: {'car': CarDetailResolver}, data: {'action': 'delete', 'back-link': '/cars'}, title: 'cars.detail.title'},
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarsRoutingModule {
}
