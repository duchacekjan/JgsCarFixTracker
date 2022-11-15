import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRoutingModule} from './auth-routing.module';
import {SignInComponent} from './sign-in/sign-in.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {VerifyMailComponent} from './verify-mail/verify-mail.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  declarations: [SignInComponent, ForgotPasswordComponent, VerifyMailComponent]
})
export class AuthModule {
}
