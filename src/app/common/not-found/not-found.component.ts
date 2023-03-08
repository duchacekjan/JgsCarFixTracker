import {Component} from '@angular/core';
import {ActionsData, NavigationService} from "../../services/navigation.service";
import {AfterNavigatedHandler} from "../base/after-navigated-handler";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent extends AfterNavigatedHandler {

  constructor(route: ActivatedRoute, navigation: NavigationService) {
    super(route, navigation);
  }

  protected override readonly matchAllRoutes = true;

  protected override getActionsData(): ActionsData | null {
    const actionsData = super.getDefaultActionsData();
    actionsData.backAction = null;
    actionsData.isMenuAvailable = false;
    return actionsData;
  }
}
