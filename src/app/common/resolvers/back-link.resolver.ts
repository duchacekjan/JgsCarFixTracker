import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {NavigationService} from "../../services/navigation.service";

@Injectable({ providedIn: 'root' })
export class BackLinkResolver implements Resolve<string> {

  constructor(private readonly navigationService: NavigationService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    console.log('resolver')
    return new Promise<string>(resolve => {
      const result = this.navigationService.currentNavigationData;
      console.log(result)
      resolve(result);
    });
  }
}
