import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {NotFoundComponent} from "./common/not-found/not-found.component";
import {SignInComponent} from "./modules/auth/sign-in/sign-in.component";
import {AuthGuard} from "./services/auth.guard";
import {CarListComponent} from "./modules/cars/car-list/car-list.component";

const routes: Routes = [
  {
    path: '', redirectTo: 'cars', pathMatch: 'full'
  },
  {
    path: 'auth/sign-in', component: SignInComponent
  },
  {
    path: 'cars', component: CarListComponent, canActivate: [AuthGuard]
  },
  {
    path: '**', pathMatch: 'full', component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
