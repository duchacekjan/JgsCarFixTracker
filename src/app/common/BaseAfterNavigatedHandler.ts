import {AfterViewInit, Component, OnDestroy} from "@angular/core";
import {ActionsData, NavigationService} from "../services/navigation.service";

@Component({template: ''})
export abstract class BaseAfterNavigatedHandler implements OnDestroy, AfterViewInit {

  protected constructor(protected navigation: NavigationService) {
    console.log('not-found-ctor')
  }

  ngAfterViewInit(): void {
    this.afterNavigated(this.navigation.currentNavigationData);
  }

  ngOnDestroy(): void {
    console.log('not-found-destroy');
  }

  protected abstract getActionsData(data: any): ActionsData;

  protected abstract isMatch(data: any): boolean;

  private afterNavigated(data: any): void {
    if (this.isMatch(data)) {
      const actions = this.getActionsData(data);
      this.navigation.updateActionsData(actions);
    }
  }
}
