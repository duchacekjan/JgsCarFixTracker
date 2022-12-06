import {AfterViewInit, Component, OnDestroy} from "@angular/core";
import {ActionsData, NavigationService} from "../services/navigation.service";

@Component({template: ''})
export abstract class BaseAfterNavigatedHandler implements AfterViewInit {

  protected constructor(protected navigation: NavigationService) {
  }

  ngAfterViewInit(): void {
    this.afterNavigated(this.navigation.currentNavigationData);
  }

  protected getActionsData(data: any): ActionsData {
    return new ActionsData();
  }

  protected isMatch(data: any): boolean {
    return false;
  };

  protected afterNavigationEnded(): void {
  }

  protected afterNavigated(data: any): void {
    if (this.isMatch(data)) {
      const actions = this.getActionsData(data);
      this.navigation.updateActionsData(actions);
      this.afterNavigationEnded();
    }
  }
}
