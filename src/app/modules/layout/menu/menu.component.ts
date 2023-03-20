import {Component, OnInit} from '@angular/core';
import {MenuService} from "../../../services/menu.service";
import {Observable} from "rxjs";
import {MenuItem} from "../../../models/menuItem";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {ActionsData, NavigationService} from "../../../services/navigation.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends AfterNavigatedHandler implements OnInit {

  menuItems: Observable<MenuItem[]>;

  constructor(
    private readonly menuService: MenuService,
    private readonly router: Router,
    route: ActivatedRoute,
    navigation: NavigationService) {
    super(route, navigation);
    this.menuItems = menuService.getItems();
  }

  navigate(link: string) {
    this.router.navigate([link]).then();
  }

  ngOnInit(): void {
    if (environment.production) {
      this.router.navigate(['/cars']).then();
    }
  }

  protected override getActionsData(): ActionsData | null {
    const result = super.getActionsData();
    if (!environment.production && result != null) {
      result.backAction = null;
    }
    return result;
  }

  protected override afterNavigationEnded() {
    super.afterNavigationEnded();
  }
}
