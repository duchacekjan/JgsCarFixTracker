import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {SplashScreenStateService} from "../services/splash-screen.service";

@Injectable()
export class BaseResolver implements Resolve<any> {

  constructor(
    private splashScreenStateService: SplashScreenStateService
  ) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.splashScreenStateService.stop();
        resolve(of(['item1', 'item2']));
      }, 1000);
    });
  }
}
