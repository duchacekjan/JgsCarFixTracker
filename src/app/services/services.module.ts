import {NgModule} from "@angular/core";
import {SettingsService} from "./settings.service";
import {SplashScreenStateService} from "./splash-screen-state.service";
import {DataService} from "./data.service";
import {AuthService} from "./auth.service";
import {NavigationService} from "./navigation.service";
import {CarsService} from "./cars.service";
import {MessagesService} from "./messages.service";
import {HelperService} from "./helper.service";

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [
    SettingsService,
    SplashScreenStateService,
    DataService,
    AuthService,
    NavigationService,
    CarsService,
    MessagesService,
    HelperService
  ]
})

export class AppServicesModule {
}
