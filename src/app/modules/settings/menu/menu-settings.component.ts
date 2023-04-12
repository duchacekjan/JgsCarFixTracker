import {Component} from '@angular/core';
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {ActivatedRoute} from "@angular/router";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {MenuService} from "../../../services/menu.service";
import {Observable} from "rxjs";
import {MenuItem} from "../../../models/menuItem";
import {Action} from "../../../models/action";

@Component({
  selector: 'app-menu-settings',
  templateUrl: './menu-settings.component.html',
  styleUrls: ['./menu-settings.component.scss']
})
export class MenuSettingsComponent extends AfterNavigatedHandler {
  menuItems: Observable<MenuItem[]>

  constructor(
    private readonly menuService: MenuService,
    route: ActivatedRoute,
    navigation: NavigationService) {
    super(route, navigation);
    this.menuItems = this.menuService.getAllItems();
  }

  protected override backLinkIfNotPresent = '/';

  protected override getActionsData(): ActionsData | null {
    const addAction = new Action('add_box');
    addAction.execute = () => this.callAdd();
    addAction.tooltip = 'settings.menu.addHint';

    const result = super.getDefaultActionsData();
    result.backAction = ActionsData.createBackAction('/');
    result.actions = [addAction];
    return result;
  }

  select(item: MenuItem) {

  }

  private callAdd() {

  }
}
