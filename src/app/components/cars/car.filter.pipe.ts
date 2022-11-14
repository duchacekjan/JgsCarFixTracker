import {Pipe, PipeTransform} from "@angular/core";
import {Car} from "../../models/car";
import {map, Observable} from "rxjs";

@Pipe({name: 'carFilter'})
export class CarFilterPipe implements PipeTransform {

  transform(items: Observable<Car[]>, searchText: string): Observable<Car[]> {
    if (searchText) {
      searchText = searchText.toLocaleLowerCase();
    }
    return items.pipe(
      map((items: Car[]) => items.filter((item: Car) => item.licencePlate.toLocaleLowerCase().includes(searchText))));
  }
}
