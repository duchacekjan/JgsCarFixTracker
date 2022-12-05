import {Component} from '@angular/core';
import {ActionsData, NavigationService} from "../../services/navigation.service";
import {BaseAfterNavigatedHandler} from "../BaseAfterNavigatedHandler";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent extends BaseAfterNavigatedHandler {

  constructor(navigation: NavigationService) {
    super(navigation);
  }

  protected isMatch(data: any): boolean {
    console.log('not-found-is-match');
    return true;
  }

  protected getActionsData(data: any): ActionsData {
    const actionsData = new ActionsData();
    actionsData.isMenuAvailable = false;
    return actionsData;
  }
}
