import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuService} from "../../../services/menu.service";
import {Subscription} from "rxjs";
import {MenuItem} from "../../../models/menuItem";
import {ActivatedRoute} from "@angular/router";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends AfterNavigatedHandler implements OnInit, OnDestroy {

  menuItems: MenuItem[] = [];
  private currentUserSubscription = new Subscription();
  private itemsSubscription = new Subscription();

  constructor(
    private readonly menuService: MenuService,
    private readonly authService: AuthService,
    route: ActivatedRoute,
    navigation: NavigationService) {
    super(route, navigation);
    this.authService.getCurrentUser().then(t => this.setUser(t));
  }

  navigate(link: string) {
    this.router.navigate([link], {
      state: {
        isFromMenu: true
      }
    }).then();
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.authService.currentUserChanged(u => this.setUser(u))
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
    this.itemsSubscription.unsubscribe();
  }

  protected override getActionsData(): ActionsData | null {
    const result = super.getActionsData();
    if (result != null) {
      result.backAction = null;
    }
    return result;
  }

  private setUser(user: any) {
    this.itemsSubscription.unsubscribe();
    setTimeout(() => {
      if (user) {
        this.itemsSubscription = this.menuService.getItems(user)
          .subscribe(items => {
            if (items.length > 1) {
              this.menuItems = items;
            } else {
              this.router.navigate(['/cars']).then();
            }
          })
      } else {
        this.menuItems = [];
      }
    }, 0);
  }
}
