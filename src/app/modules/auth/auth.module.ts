import {NgModule} from "@angular/core";
import {SignInComponent} from './sign-in/sign-in.component';
import {CommonModule} from "@angular/common";
import {AuthRoutingModule} from "./auth-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material.module";
import {ActionsComponent} from "./actions/actions.component";
import {ForgotPasswordComponent} from './actions/forgot-password/forgot-password.component';
import {ConfirmResetPasswordComponent} from './actions/confirm-reset-password/confirm-reset-password.component';
import {AppCommonModule} from "../../common/app-common.module";
import {VerifyEmailComponent} from './actions/verify-email/verify-email.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AuthRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    AppCommonModule
  ],
  declarations: [
    SignInComponent,
    ActionsComponent,
    ForgotPasswordComponent,
    ConfirmResetPasswordComponent,
    VerifyEmailComponent
  ]
})

export class AppAuthModule {
}
