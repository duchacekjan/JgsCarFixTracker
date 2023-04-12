import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LayoutComponent} from "./layout.component";
import {AppAuthModule} from "../auth/auth.module";
import {CarsModule} from "../cars/cars.module";
import {AuthGuard} from "../../services/auth.guard";
import {SettingsModule} from "../settings/settings.module";
import {NotFoundComponent} from "../../common/not-found/not-found.component";
import {NotificationsModule} from "../notifications/notifications.module";
import {MenuComponent} from "./menu/menu.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: MenuComponent, canActivate: [AuthGuard], title: 'menu.title'},
      {path: 'auth', loadChildren: () => AppAuthModule},
      {path: 'cars', loadChildren: () => CarsModule, canActivate: [AuthGuard]},
      {path: 'settings', loadChildren: () => SettingsModule},
      {path: 'notifications', loadChildren: () => NotificationsModule, canActivate: [AuthGuard]},
      {path: 'not-found', component: NotFoundComponent, title: 'errors.notFound'},
      {path: '**', redirectTo: 'not-found', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppLayoutRoutingModule {
}
