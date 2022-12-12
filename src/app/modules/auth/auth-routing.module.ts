import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from "./sign-in/sign-in.component";
import {ActionsComponent} from "./actions/actions.component";
import {AuthActionsGuard} from "../../services/auth-actions.guard";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {AuthActionsTitleResolver} from "../../common/resolvers/auth-actions-title.resolver";

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'sign-in', component: SignInComponent, title: 'auth.signIn.title'},
      {path: 'forgot-password', component: ForgotPasswordComponent, title: 'auth.forgotPassword.title'},
      {path: 'actions', component: ActionsComponent, canActivate: [AuthActionsGuard], title: AuthActionsTitleResolver},
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
