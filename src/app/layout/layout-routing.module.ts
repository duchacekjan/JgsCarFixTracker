import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthModule} from '../components/auth/auth.module';
import {CarsModule} from '../components/cars/cars.module';
import {AuthGuard} from '../services/guard/auth.guard';
import {MainComponent} from './main/main.component';
import {SettingsModule} from "../components/settings/settings.module";

const routes: Routes = [
  {
    path: '', redirectTo: 'cars', pathMatch: 'full'
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {path: 'settings', loadChildren: () => SettingsModule},
      {path: 'cars', loadChildren: () => CarsModule, canActivate: [AuthGuard]},
      {path: 'auth', loadChildren: () => AuthModule}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {
}
