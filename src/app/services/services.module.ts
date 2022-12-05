import {NgModule} from "@angular/core";
import {SettingsService} from "./settings.service";
import {SplashScreenStateService} from "./splash-screen-state.service";
import {DataService} from "./data.service";
import {AuthService} from "./auth.service";
import {NavigationService} from "./navigation.service";

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [
    SettingsService,
    SplashScreenStateService,
    DataService,
    AuthService,
    NavigationService
  ]
})

export class AppServicesModule {
}
