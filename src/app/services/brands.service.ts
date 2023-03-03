import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {TranslateService} from "@ngx-translate/core";
import {DataService} from "./data.service";
import {map, Observable} from "rxjs";
import {Brand} from "../models/brand";

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private brandsRef: AngularFireList<Brand>;

  constructor(private db: AngularFireDatabase, private translate: TranslateService, private dataService: DataService) {
    this.brandsRef = this.db.list("items/brands");
  }

  search(searchText?: string): Promise<Observable<Brand[]>> {
    return this.dataService.execute(this.searchAsync(searchText));
  }

  upsertBrand(brand: Brand) {
    let data = {
      name: brand.name,
      searchName: brand.searchName,
      models: brand.models
    }
    if (!brand.key) {
      return this.brandsRef.push(data);
    } else {
      return this.brandsRef.update(brand.key, data);
    }
  }

  remove(brand: Brand) {
    if (!brand.key) {
      return;
    }

    return this.brandsRef.remove(brand.key);
  }

  private searchAsync(searchText?: string): Promise<Observable<Brand[]>> {
    return new Promise<Observable<Brand[]>>((resolve) => {
      const result = this.brandsRef.snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            (<Brand>{key: c.key, ...c.payload.val()}))
        ))
        .pipe(
          map((items: Brand[]) => items.filter((item: Brand) => item.searchName.includes(searchText!)))
        );
      resolve(result);
    });

  }
}
