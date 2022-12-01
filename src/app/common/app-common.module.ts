import {NgModule} from "@angular/core";
import {NotFoundComponent} from './not-found/not-found.component';
import {SplashScreenComponent} from './splash-screen/splash-screen.component';
import {MaterialModule} from "../material.module";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    NotFoundComponent,
    SplashScreenComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  exports: [
    SplashScreenComponent
  ],
})

export class AppCommonModule {
}
