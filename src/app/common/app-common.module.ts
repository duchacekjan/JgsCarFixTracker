import {NgModule} from "@angular/core";
import {NotFoundComponent} from './not-found/not-found.component';
import {SplashScreenComponent} from './splash-screen/splash-screen.component';
import {MaterialModule} from "../material.module";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LayoutComponent} from './layout/layout.component';
import {TranslateModule} from "@ngx-translate/core";
import {AppCommonRoutingModule} from "./app-common-routing.module";
import {SnackBarComponent} from './snack-bar/snack-bar.component';
import {DialogComponent} from './dialog/dialog.component';
import {BackLinkResolver} from "./resolvers/back-link.resolver";
import {PasswordStrengthHintComponent} from "./password-strength-hint/password-strength-hint.component";

@NgModule({
  declarations: [
    NotFoundComponent,
    SplashScreenComponent,
    LayoutComponent,
    SnackBarComponent,
    DialogComponent,
    PasswordStrengthHintComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AppCommonRoutingModule,
    BrowserAnimationsModule,
    TranslateModule
  ],
  exports: [
    SplashScreenComponent,
    PasswordStrengthHintComponent
  ],
  providers: [
    BackLinkResolver
  ]
})

export class AppCommonModule {
}
