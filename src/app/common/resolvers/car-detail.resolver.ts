import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Car} from "../../models/car";
import {CarsService} from "../../services/cars.service";

@Injectable()
export class CarDetailResolver implements Resolve<Observable<Car>> {

  constructor(private carsService: CarsService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<Car>> {
    const id = route.paramMap.get('id')!;
    return this.carsService.getCar(id);
  }
}

