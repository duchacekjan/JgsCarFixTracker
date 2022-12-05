import {NgModule} from "@angular/core";
import {SignInComponent} from './sign-in/sign-in.component';
import {CommonModule} from "@angular/common";
import {AuthRoutingModule} from "./auth-routing.module";

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule
  ],
  declarations: [
    SignInComponent
  ]
})

export class AppAuthModule {
}
