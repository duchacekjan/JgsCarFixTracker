import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthModule} from '../modules/auth/auth.module';
import {CarsModule} from '../modules/cars/cars.module';
import {SettingsModule} from "../modules/settings/settings.module";
import {LayoutComponent} from "./layout/layout.component";
import {AuthGuard} from "../services/auth.guard";
import {BaseResolver} from "../resolvers/BaseResolver";

const routes: Routes = [
  {
    path: '', redirectTo: 'cars', pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: 'settings', loadChildren: () => SettingsModule},
      {path: 'cars', loadChildren: () => CarsModule, canActivate: [AuthGuard]},
      {path: 'auth', loadChildren: () => AuthModule}
    ],
    resolve: {'items': BaseResolver}
  },
  {path: '**', pathMatch: 'full', redirectTo: '/cars?notFound'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppCommonRoutingModule {
}
