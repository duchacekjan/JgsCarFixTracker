import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { Car } from '../models/car';
import { User } from '../models/user';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private dbPath = '/cars';

  carsRef: AngularFireList<Car>;

  constructor(private db: AngularFireDatabase, private userService: UsersService) {
    const path = this.getDbPath();
    this.carsRef = db.list(path)
  }

  getCar(key: string): Observable<Car> {
    const path = this.getDbPath(key);
    return this.db.object(path)
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

  private getDbPath(key?: string): string {
    const uid = this.userService.getUserUid();
    const keyValue = key ? `/${key}` : '';
    return `${this.dbPath}/${uid}${keyValue}`;
  }
}
