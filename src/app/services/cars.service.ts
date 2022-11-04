import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { CarDto } from '../models/car';
import { User } from '../models/user';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private dbPath = '/cars';

  constructor(private db: AngularFireDatabase, private userService: UsersService) { }

  getCar(key: string): Observable<CarDto> {
    const path = this.userService.buildDbPath(this.dbPath, key);
    return this.db.object(path)
      .snapshotChanges().pipe(
        map(changes =>
          ({ key: changes.payload.key, ...changes.payload.val() as CarDto })));
  }

  getCars(): AngularFireList<CarDto> {
    const path = this.userService.buildDbPath(this.dbPath);
    return this.db.list(path)
  }

  upsert(car: CarDto): Promise<string> {
    return new Promise((resolve, reject) => {
      if (car.key) {
        console.log(car);
        this.update(car)
          .then(() => resolve(car.key!))
          .catch(reject);
      } else {
        if (car) {
          const key = this.create(car);
          resolve(key);
        }else{
          reject('No car defined');
        }
      }
    });
  }

  create(car: CarDto): string {
    return this.getCars().push(car).key!;
  }

  update(value: CarDto): Promise<void> {
    const key = value.key!;
    const data = this.stripKey(value);
    return this.getCars().update(key, data);
  }

  private stripKey(car: CarDto): any {
    return {
      licencePlate: car.licencePlate,
      brand: car.brand,
      model: car.model,
      fixes: car.fixes
    }
  }
}
