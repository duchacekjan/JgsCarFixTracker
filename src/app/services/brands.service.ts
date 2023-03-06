import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {map, Observable} from "rxjs";
import {Brand} from "../models/brand";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private brandsRef: AngularFireList<Brand>;

  constructor(private db: AngularFireDatabase) {
    const prefix = environment.production ? "" : "test/"
    this.brandsRef = this.db.list(prefix + "brands");
  }

  getList(): Observable<Brand[]> {
    return this.brandsRef.snapshotChanges().pipe(
      map(changes => {
          return changes.map(c =>
            (<Brand>{key: c.key, ...c.payload.val()}))
        }
      )
    );
  }

  upsertBrand(brand: Brand) {
    let data = {
      name: brand.name,
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
      return Promise.resolve();
    }

    return this.brandsRef.remove(brand.key);
  }
}
