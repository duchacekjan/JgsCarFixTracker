import {Component} from '@angular/core';
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {ActivatedRoute} from "@angular/router";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {MenuService} from "../../../services/menu.service";
import {Observable} from "rxjs";
import {MenuItem} from "../../../models/menuItem";
import {Action} from "../../../models/action";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-menu-settings',
  templateUrl: './menu-settings.component.html',
  styleUrls: ['./menu-settings.component.scss']
})
export class MenuSettingsComponent extends AfterNavigatedHandler {
  menuItems: Observable<MenuItem[]>;
  isDrawerOpened: boolean = false;
  isNewRowBeingAdded: boolean = false;

  menuItemForm!: FormGroup;

  constructor(
    private readonly menuService: MenuService,
    route: ActivatedRoute,
    navigation: NavigationService) {
    super(route, navigation);
    this.menuItems = this.menuService.getAllItems();
    this.menuItemForm = new FormGroup({
      key: new FormControl(undefined),
      icon: new FormControl(''),
      route: new FormControl(''),
      tooltip: new FormControl(''),
      name: new FormControl(''),
      allowed: new FormControl([]),
    });
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
    this.isDrawerOpened = true;
  }

  updateTableData() {
    this.isDrawerOpened = false;
  }

  private callAdd() {

  }
}
