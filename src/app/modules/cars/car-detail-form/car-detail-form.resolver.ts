import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SplashScreenStateService} from "../../../services/splash-screen-state.service";
import {Car} from "../../../models/car";
import {CarsService} from "../../../services/cars.service";

@Injectable()
export class CarDetailFormResolver implements Resolve<Observable<Car>> {

  constructor(private splashScreenStateService: SplashScreenStateService, private carsService:CarsService) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<Car>> {
    const id = route.queryParamMap.get('id')??'new';
    return this.carsService.getCar(id);
  }
}
