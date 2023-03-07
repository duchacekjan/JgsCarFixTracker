import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BackLinkResolver} from "../../common/resolvers/back-link.resolver";
import {NotificationsListComponent} from "./notifications-list/notifications-list.component";

const routes: Routes = [
  {path: '', component: NotificationsListComponent, title: 'notifications.list.title', resolve: {'back-link': BackLinkResolver}},
  // {path: 'new', component: CarDetailFormComponent, resolve: {'back-link': BackLinkResolver, 'car': CarDetailResolver}, data: {'is-new': true}, title: 'cars.detail.new.title'},
  // {path: ':id', component: CarDetailComponent, resolve: {'car': CarDetailResolver}, data: {'back-link': '/cars'}, title: 'cars.detail.title'},
  // {path: ':id/edit', component: CarDetailFormComponent, resolve: {'back-link': BackLinkResolver, 'car': CarDetailResolver}, data: {'is-new': false}, title: 'cars.detail.title'},
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule {
}
