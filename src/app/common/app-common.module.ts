import {NgModule} from "@angular/core";
import { NotFoundComponent } from './not-found/not-found.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    SplashScreenComponent
  ],
  imports: [],
  exports: [],
})

export class AppCommonModule {
}
