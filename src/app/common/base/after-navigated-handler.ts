import {AfterViewInit, Component, inject} from "@angular/core";
import {ActionsData, NavigationService} from "../../services/navigation.service";
import {ActivatedRoute, Params} from "@angular/router";
import {ServiceProvider} from "./service-provider";


@Component({
  template: '',
  providers: [ServiceProvider]
})
export abstract class AfterNavigatedHandler implements AfterViewInit {

  private backLink?: string;
  private readonly serviceProvider = inject(ServiceProvider);
  protected readonly router = this.serviceProvider.router;
  private readonly isFromMenu: boolean;

  protected constructor(protected route: ActivatedRoute, protected navigation: NavigationService) {
    let state = this.router.getCurrentNavigation()?.extras.state ?? {};
    this.isFromMenu = state['isFromMenu'] ?? false;
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

  protected getDefaultActionsData(): ActionsData {
    const result = new ActionsData();
    if (this.isFromMenu) {
      result.backAction = ActionsData.createBackAction('/');
    } else if (this.finalBackLink !== undefined) {
      result.backAction = ActionsData.createBackAction(this.finalBackLink);
    }
    return result;
  }

  protected getActionsData(): ActionsData | null {
    return this.getDefaultActionsData();
  }

  protected afterNavigationEnded(): void {

  }

  protected navigateWithoutHistory(path: string, queryParams: Params = {}) {
    return this.navigation.navigateWithoutHistory(path, this.route, queryParams);
  }

  protected afterNavigated(): void {
    if (this.route.snapshot.component?.name === this.constructor.name || this.matchAllRoutes) {
      const actions = this.getActionsData();
      if (actions != null) {
        this.navigation.updateActionsData(actions);
      }
      this.afterNavigationEnded();
    }
  }
}
