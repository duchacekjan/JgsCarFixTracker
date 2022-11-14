import {Pipe, PipeTransform} from "@angular/core";
import {Car} from "../../models/car";

@Pipe({name: 'carFilter'})
export class CarFilterPipe implements PipeTransform {

  transform(items: Car[], searchText: string): Car[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      return it.licencePlate.toLocaleLowerCase().includes(searchText);
    });
  }

}
