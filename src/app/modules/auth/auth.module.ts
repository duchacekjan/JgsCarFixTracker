import {NgModule} from "@angular/core";
import {SignInComponent} from './sign-in/sign-in.component';
import {CommonModule} from "@angular/common";
import {AuthRoutingModule} from "./auth-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material.module";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AuthRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [
    SignInComponent
  ]
})

export class AppAuthModule {
}
