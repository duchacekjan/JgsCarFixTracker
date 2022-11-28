import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRoutingModule} from './auth-routing.module';
import {SignInComponent} from './sign-in/sign-in.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {VerifyMailComponent} from './verify-mail/verify-mail.component';
import {TranslateModule} from "@ngx-translate/core";
import {ActionsComponent} from './actions/actions.component';
import {ForgotPasswordComponent} from "./actions/forgot-password/forgot-password.component";
import {MaterialModule} from "../../material.module";
import { ConfirmResetPasswordComponent } from './actions/confirm-reset-password/confirm-reset-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [SignInComponent, ForgotPasswordComponent, VerifyMailComponent, ActionsComponent, ConfirmResetPasswordComponent]
})
export class AuthModule {
}
