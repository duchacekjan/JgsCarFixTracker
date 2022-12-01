import {NgModule} from "@angular/core";
import {NotFoundComponent} from './not-found/not-found.component';
import {SplashScreenComponent} from './splash-screen/splash-screen.component';
import {MaterialModule} from "../materialDesign/material.module";
import {CommonModule} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    NotFoundComponent,
    SplashScreenComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatProgressSpinnerModule
  ],
  exports: [
    SplashScreenComponent
  ],
})

export class AppCommonModule {
}
