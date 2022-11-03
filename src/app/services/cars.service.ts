import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { Car, CarDto } from '../models/car';
import { User } from '../models/user';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private dbPath = '/cars';

  carsRef: AngularFireList<CarDto>;

  constructor(private db: AngularFireDatabase, private userService: UsersService) {
    const path = this.userService.buildDbPath(this.dbPath);
    this.carsRef = db.list(path)
  }

  getCar(key: string): Observable<CarDto> {
    const path = this.userService.buildDbPath(this.dbPath, key);
    return this.db.object(path)
      .snapshotChanges().pipe(
        map(changes =>
          ({ key: changes.payload.key, ...changes.payload.val() as Car })));
  }

  getCars(): AngularFireList<CarDto> {
    return this.carsRef;
  }

  create(car: Car): string {
    return this.carsRef.push(car).key!;
  }

  update(value: CarDto): Promise<void> {
    const key = value.key!;
    return this.carsRef.update(key, this.stripKey(value));
  }

  private stripKey(car: CarDto): Car {
    return {
      licencePlate: car.licencePlate,
      brand: car.brand,
      model: car.model
    }
  }
}
