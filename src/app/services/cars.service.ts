import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList, DatabaseSnapshot} from '@angular/fire/compat/database';
import {map, Observable} from 'rxjs';
import {Car} from '../models/car';
import {UsersService} from './users.service';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private dbPath = '/cars';
  private readonly carsRef: AngularFireList<Car>

  constructor(private db: AngularFireDatabase, private userService: UsersService) {
    const path = this.userService.buildDbPath(this.dbPath);
    this.carsRef = this.db.list(path);
  }

  getCar(key: string): Observable<Car> {
    const path = this.userService.buildDbPath(this.dbPath, key);
    return this.db.object<Car>(path)
      .snapshotChanges().pipe(
        map(changes => {
          return (this.reMap(changes.payload, key));
        }));
  }

  private reMap(dbCar: DatabaseSnapshot<Car>, key: string): Car {
    const data = dbCar.val();
    if (data === null || data === undefined) {
      let temp = new Car();
      temp.key = key === 'new' ? null : undefined;
      return temp;
    }
    let result = new Car();
    result.key = dbCar.key;
    if (data.brand) {
      result.brand = data.brand;
    }
    if (data.model) {
      result.model = data.model;
    }
    if (data.licencePlate) {
      result.licencePlate = data.licencePlate;
    }
    //const fixes = data.fixes ?? [];
    result.fixes = data.fixes ?? [];
    // result.fixes = fixes.sort((a, b) => {
    //   if (a.mileage < b.mileage) {
    //     return 1;
    //   }
    //   if (a.mileage > b.mileage) {
    //     return -1;
    //   }
    //   return 0;
    // });
    return result;
  }

  getCars(): Observable<Car[]> {
    return this.carsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          (this.reMap(c.payload, 'new'))))
    )
      .pipe(
        map((items: Car[]) => items.filter((item: Car) => item.licencePlate !== ''))
      );
  }

  search(searchText?: string): Observable<Car[]> {
    if (searchText) {
      searchText = searchText.toLocaleLowerCase();
    } else {
      searchText = '';
    }
    return this.getCars().pipe(
      map((items: Car[]) => items.filter((item: Car) => item.licencePlate.toLocaleLowerCase().includes(searchText!))));
  }

  remove(car: Car): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (car.key) {
        this.carsRef.remove(car.key)
          .then(() => resolve())
          .catch(err => reject(err));
      }
      reject();
    });
  }

  upsert(car: Car): Promise<string> {
    return new Promise(async (resolve, reject) => {
      console.log(`CarKey = ${car.key}`)
      if (car.key) {
        console.log(car);
        this.update(car)
          .then(() => resolve(car.key!))
          .catch(reject);
      } else {
        if (car) {
          let item =await this.carsRef.query.orderByChild('licencePlate').equalTo(car.licencePlate).limitToFirst(1).get();
          if (item.val() as Car) {
            reject('Already in DB')
          } else {
            const key = this.create(car);
            resolve(key);
          }
        } else {
          reject('No car defined');
        }
      }
    });
  }

  create(car: Car): string {
    return this.carsRef.push(car).key!;
  }

  update(value: Car): Promise<void> {
    const key = value.key!;
    const data = this.stripKey(value);
    return this.carsRef.update(key, data);
  }

  private stripKey(car: Car): any {
    return {
      licencePlate: car.licencePlate,
      brand: car.brand,
      model: car.model,
      fixes: car.fixes
    }
  }
}
