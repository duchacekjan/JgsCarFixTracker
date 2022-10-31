import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { Car } from '../models/car';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private dbPath = '/cars';

  carsRef: AngularFireList<Car>;

  constructor(private db: AngularFireDatabase) {
    this.carsRef = db.list(this.dbPath)
  }
  getCar(key: string): Observable<Car> {
    return this.db.object(this.dbPath + '/' + key)
      .snapshotChanges().pipe(
        map(changes =>
          ({ key: changes.payload.key, ...changes.payload.val() as Car })));
  }

  getCars(): AngularFireList<Car> {
    return this.carsRef;
  }

  create(car: Car): any {
    return this.carsRef.push(car);
  }

  update(key: string, value: any): Promise<void> {
    return this.carsRef.update(key, value);
  }
}
