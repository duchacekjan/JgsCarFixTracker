import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRoutingModule} from './auth-routing.module';
import {SignInComponent} from './sign-in/sign-in.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import {ActionsComponent} from './actions/actions.component';
import {ForgotPasswordComponent} from "./actions/forgot-password/forgot-password.component";
import {MaterialModule} from "../../material.module";
import {ConfirmResetPasswordComponent} from './actions/confirm-reset-password/confirm-reset-password.component';
import { VerifyEmailComponent } from './actions/verify-email/verify-email.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [SignInComponent, ForgotPasswordComponent, ActionsComponent, ConfirmResetPasswordComponent, VerifyEmailComponent]
})
export class AuthModule {
}
