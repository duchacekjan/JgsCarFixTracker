import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CarListComponent} from './car-list/car-list.component';
import {CarDetailFormComponent} from "./car-detail-form/car-detail-form.component";
import {CarDetailComponent} from "./car-detail/car-detail.component";
import {CarDetailCarResolver} from "./car-detail/car-detail.resolver";
import {BackLinkResolver} from "../../common/resolvers/back-link.resolver";

const routes: Routes = [
  {path: '', component: CarListComponent},
  {path: 'new', component: CarDetailFormComponent, resolve: {'back-link': BackLinkResolver, 'car': CarDetailCarResolver}, data: {'is-new': true}},
  {path: ':id', component: CarDetailComponent, resolve: {'car': CarDetailCarResolver}, data: {'back-link': '/cars'}},
  {path: ':id/edit', component: CarDetailFormComponent, resolve: {'back-link': BackLinkResolver, 'car': CarDetailCarResolver}, data: {'is-new': false}},
  {path: ':id/delete', component: CarDetailComponent, resolve: {'car': CarDetailCarResolver}, data: {'action': 'delete', 'back-link': '/cars'}},
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarsRoutingModule {
}
