import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LayoutComponent} from "./layout.component";
import {AppAuthModule} from "../auth/auth.module";
import {CarsModule} from "../cars/cars.module";
import {AuthGuard} from "../../services/auth.guard";
import {SettingsModule} from "../settings/settings.module";
import {NotFoundComponent} from "../../common/not-found/not-found.component";

const routes: Routes = [
  {path: '', redirectTo: 'cars', pathMatch: 'full'},
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: 'auth', loadChildren: () => AppAuthModule},
      {path: 'cars', loadChildren: () => CarsModule, canActivate: [AuthGuard]},
      {path: 'settings', loadChildren: () => SettingsModule},
      {path: 'not-found', component: NotFoundComponent},
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
