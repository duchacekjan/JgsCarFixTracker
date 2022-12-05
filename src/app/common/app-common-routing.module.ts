import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CarListComponent} from "../modules/cars/car-list/car-list.component";
import {AuthGuard} from "../services/auth.guard";
import {NotFoundComponent} from "./not-found/not-found.component";
import {LayoutComponent} from "./layout/layout.component";
import {AppAuthModule} from "../modules/auth/auth.module";

const routes: Routes = [
  {path: '', redirectTo: 'cars', pathMatch: 'full'},
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: 'auth', loadChildren: () => AppAuthModule},
      {path: 'cars', component: CarListComponent, canActivate: [AuthGuard]},
      {path: 'cars/detail/new', component: CarListComponent, canActivate: [AuthGuard]},
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
