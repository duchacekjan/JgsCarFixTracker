import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuService} from "../../../services/menu.service";
import {Observable, Subscription} from "rxjs";
import {MenuItem} from "../../../models/menuItem";
import {ActivatedRoute} from "@angular/router";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {ActionsData, NavigationService} from "../../../services/navigation.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends AfterNavigatedHandler implements OnInit, OnDestroy {

  menuItems: Observable<MenuItem[]>;
  private isMenuActiveSubscription = new Subscription();

  constructor(
    private readonly menuService: MenuService,
    route: ActivatedRoute,
    navigation: NavigationService) {
    super(route, navigation);
    this.menuItems = menuService.getItems();
  }

  navigate(link: string) {
    this.router.navigate([link], {
      state: {
        isFromMenu: true
      }
    }).then();
  }

  ngOnInit(): void {
    this.isMenuActiveSubscription = this.menuService.getIsMenuActive().subscribe(c => {
      if (!c) {
        this.router.navigate(['/cars']).then();
      }
    });
  }

  ngOnDestroy() {
    this.isMenuActiveSubscription.unsubscribe()
  }

  protected override getActionsData(): ActionsData | null {
    const result = super.getActionsData();
    if (result != null) {
      result.backAction = null;
    }
    return result;
  }
}
