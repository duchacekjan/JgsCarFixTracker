import {Component} from '@angular/core';
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {NavigationService} from "../../../services/navigation.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  //template: '<h1>UNDER CONSTRUCTION</h1>',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent extends AfterNavigatedHandler {

}
