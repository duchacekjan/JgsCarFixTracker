import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {AppCommonRoutingModule} from "./app-common-routing.module";
import {MaterialModule} from "../material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {SnackBarComponent} from "./snack-bar/snack-bar.component";
import {DialogComponent} from "./dialog/dialog.component";
import {LayoutComponent} from "./layout/layout.component";
import { SplashScreenComponent } from './splash-screen/splash-screen.component';

@NgModule({
  imports: [
    CommonModule,
    AppCommonRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule
  ],
    exports: [
        SplashScreenComponent
    ],
  declarations: [
    LayoutComponent, SnackBarComponent, DialogComponent, SplashScreenComponent
  ]
})
export class AppCommonModule {
}
