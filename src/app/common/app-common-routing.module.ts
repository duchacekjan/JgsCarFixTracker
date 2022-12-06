import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CarListComponent} from "../modules/cars/car-list/car-list.component";
import {AuthGuard} from "../services/auth.guard";
import {NotFoundComponent} from "./not-found/not-found.component";
import {LayoutComponent} from "./layout/layout.component";
import {AppAuthModule} from "../modules/auth/auth.module";
import {CarsModule} from "../modules/cars/cars.module";
import {SettingsModule} from "../modules/settings/settings.module";

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
export class AppCommonRoutingModule {
}
