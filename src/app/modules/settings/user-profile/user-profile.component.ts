import {Component} from '@angular/core';
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {NavigationService} from "../../../services/navigation.service";

@Component({
  selector: 'app-user-profile',
  //templateUrl: './user-profile.component.html',
  template: '<h1>UNDER CONSTRUCTION</h1>',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent extends AfterNavigatedHandler {

  constructor(navigation: NavigationService) {
    super(navigation);
  }


  protected override isMatch(data: any): boolean {
    return true;
  }
}
