import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SplashScreenStateService} from "../../../services/splash-screen-state.service";
import {Car} from "../../../models/car";
import {CarsService} from "../../../services/cars.service";
import {NavigationService} from "../../../services/navigation.service";

@Injectable()
export class CarDetailFormCarResolver implements Resolve<Observable<Car>> {

  constructor(
    private readonly splashScreenStateService: SplashScreenStateService,
    private readonly carsService: CarsService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<Car>> {
    const id = route.queryParamMap.get('id') ?? 'new';
    return this.carsService.getCar(id);
  }
}

@Injectable()
export class CarDetailFormIsNewResolver implements Resolve<boolean> {

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      const result = route.queryParamMap.get('id') === null;
      resolve(result);
    });
  }
}

@Injectable()
export class CarDetailFormBackLinkResolver implements Resolve<string> {

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
