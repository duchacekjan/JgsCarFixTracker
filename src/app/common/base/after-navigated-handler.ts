import {AfterViewInit, Component} from "@angular/core";
import {ActionsData, NavigationService} from "../../services/navigation.service";
import {ActivatedRoute, Params} from "@angular/router";


@Component({template: ''})
export abstract class AfterNavigatedHandler implements AfterViewInit {

  private backLink?: string;

  constructor(protected route: ActivatedRoute, protected navigation: NavigationService) {
  }

  ngAfterViewInit(): void {
    this.backLink = this.route.snapshot.data['back-link'];
    this.afterNavigated();
  }

  private get finalBackLink(): string | undefined {
    return this.backLink ?? this.backLinkIfNotPresent;
  }

  protected readonly matchAllRoutes: boolean = false;
  protected readonly backLinkIfNotPresent?: string;

  protected getRouteData(key: string): any {
    return this.route.snapshot.data[key];
  }

  protected getRouteParam(key: string): any {
    return this.route.snapshot.paramMap.get(key);
  }

  protected getQueryParam(key: string, defaultValue?: any): any {
    return this.route.snapshot.queryParamMap.get(key) ?? defaultValue;
  }

  protected getActionsData(): ActionsData {
    const result = new ActionsData();
    if (this.finalBackLink !== undefined) {
      result.backAction = ActionsData.createBackAction(this.finalBackLink);
    }
    return result;
  }

  protected afterNavigationEnded(): void {

  }

  protected navigateWithoutHistory(path: string, queryParams: Params = {}) {
    return this.navigation.navigateWithoutHistory(path, this.route, queryParams);
  }

  protected afterNavigated(): void {
    if (this.route.snapshot.component?.name === this.constructor.name || this.matchAllRoutes) {

      if (this.route.snapshot.component?.name != "LayoutComponent") {
        const actions = this.getActionsData();
        this.navigation.updateActionsData(actions);
      }
      this.afterNavigationEnded();
    }
  }
}
