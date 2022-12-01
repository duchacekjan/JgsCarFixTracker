import {NgModule} from "@angular/core";
import {SettingsService} from "./settings.service";
import {SplashScreenStateService} from "./splash-screen-state.service";
import {DataService} from "./data.service";

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [
    SettingsService,
    SplashScreenStateService,
    DataService
  ]
})

export class AppServicesModule {
}
