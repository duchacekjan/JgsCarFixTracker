import {NgModule} from "@angular/core";
import {NotFoundComponent} from './not-found/not-found.component';
import {SplashScreenComponent} from './splash-screen/splash-screen.component';
import {MaterialModule} from "../material.module";
import {TranslateModule} from "@ngx-translate/core";
import {SnackBarComponent} from './snack-bar/snack-bar.component';
import {DialogComponent} from './dialog/dialog.component';
import {PasswordStrengthHintComponent} from "./password-strength-hint/password-strength-hint.component";
import {CommonModule} from "@angular/common";
import {NotificationDatePipe} from "./NotificationDatePipe";

@NgModule({
  declarations: [
    NotFoundComponent,
    SplashScreenComponent,
    SnackBarComponent,
    DialogComponent,
    PasswordStrengthHintComponent,
    NotificationDatePipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule
  ],
  exports: [
    SplashScreenComponent,
    PasswordStrengthHintComponent,
    NotificationDatePipe
  ]
})

export class AppCommonModule {
}
