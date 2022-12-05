import {NgModule} from "@angular/core";
import {NotFoundComponent} from './not-found/not-found.component';
import {SplashScreenComponent} from './splash-screen/splash-screen.component';
import {MaterialModule} from "../material.module";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LayoutComponent} from './layout/layout.component';
import {TranslateModule} from "@ngx-translate/core";
import {AppCommonRoutingModule} from "./app-common-routing.module";

@NgModule({
  declarations: [
    NotFoundComponent,
    SplashScreenComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AppCommonRoutingModule,
    BrowserAnimationsModule,
    TranslateModule
  ],
  exports: [
    SplashScreenComponent
  ],
})

export class AppCommonModule {
}
