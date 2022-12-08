import {Component} from '@angular/core';
import {ActionsData, NavigationService} from "../../services/navigation.service";
import {AfterNavigatedHandler} from "../base/after-navigated-handler";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent extends AfterNavigatedHandler {

  constructor(navigation: NavigationService) {
    super(navigation);
  }

  protected override isMatch(data: any): boolean {
    console.log('not-found-is-match');
    return true;
  }

  protected override getActionsData(data: any): ActionsData {
    const actionsData = new ActionsData();
    actionsData.isMenuAvailable = false;
    return actionsData;
  }
}
