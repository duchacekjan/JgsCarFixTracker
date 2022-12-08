import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from "./sign-in/sign-in.component";
import {ActionsComponent} from "./actions/actions.component";
import {AuthActionsGuard} from "../../services/auth-actions.guard";

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'sign-in', component: SignInComponent},
      {path: 'actions', component: ActionsComponent, canActivate: [AuthActionsGuard]},
      {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
