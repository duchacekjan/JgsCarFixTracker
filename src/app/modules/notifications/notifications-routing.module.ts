import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BackLinkResolver} from "../../common/resolvers/back-link.resolver";
import {NotificationsListComponent} from "./notifications-list/notifications-list.component";
import {NotificationsAdminComponent} from "./notifications-admin/notifications-admin.component";

const routes: Routes = [
  {path: '', component: NotificationsListComponent, title: 'notifications.list.title', resolve: {'back-link': BackLinkResolver}},
  {path: 'admin', component: NotificationsAdminComponent, title: 'notifications.admin.title', resolve: {'back-link': BackLinkResolver}},
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule {
}
