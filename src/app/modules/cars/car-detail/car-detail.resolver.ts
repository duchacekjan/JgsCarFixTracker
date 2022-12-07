import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Car} from "../../../models/car";
import {SplashScreenStateService} from "../../../services/splash-screen-state.service";
import {CarsService} from "../../../services/cars.service";

@Injectable()
export class CarDetailCarResolver implements Resolve<Observable<Car>> {

  constructor(private splashScreenStateService: SplashScreenStateService, private carsService: CarsService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<Car>> {
    const id = route.paramMap.get('id')!;
    return this.carsService.getCar(id);
  }
}

@Injectable()
export class CarDetailActionResolver implements Resolve<string> {
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    return new Promise<string>(resolve => {
      const action = route.paramMap.get('action') ?? '';
      resolve(action);
    });
  }
}

