import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SignInComponent} from './sign-in/sign-in.component';
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {VerifyMailComponent} from "./verify-mail/verify-mail.component";
import {ActionsComponent} from "./actions/actions.component";

const routes: Routes = [
  {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
  {
    path: 'sign-in', component: SignInComponent
  },
  {
    path: 'actions', component: ActionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
