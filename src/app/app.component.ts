import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {NavigationService} from "./services/navigation.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  constructor(
    private readonly translate: TranslateService,
    private readonly navigation: NavigationService) {
    translate.setDefaultLang('cs');
    translate.use('cs');
  }
}
