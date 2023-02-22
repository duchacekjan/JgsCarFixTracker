import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList, DatabaseSnapshot} from '@angular/fire/compat/database';
import {map, Observable} from 'rxjs';
import {Car} from '../models/car';
import {TranslateService} from "@ngx-translate/core";
import {DataService} from "./data.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private dbPath = '/cars';

  constructor(private db: AngularFireDatabase, private auth: AuthService, private translate: TranslateService, private dataService: DataService) {
  }

  getCar(key: string): Promise<Observable<Car>> {
    return this.dataService.execute(this.getCarAsync(key));
  }

  search(searchText?: string): Promise<Observable<Car[]>> {
    return this.dataService.execute(this.searchAsync(searchText));
  }

  remove(car: Car): Promise<void> {
    return this.dataService.execute(this.removeAsync(car));
  }

  upsert(car: Car): Promise<string> {
    return this.dataService.execute(this.upsertAsync(car));
  }

  update(value: Car): Promise<void> {
    return this.dataService.execute(this.updateAsync(value));
  }

  stkIsClose(value: Car): boolean {
    if (value.stk) {
      let dateStk = new Date(value.stk);
      let offset = new Date();
      offset.setDate(offset.getDate() + 60);
      return dateStk < offset
    } else {
      return false;
    }
  }

  isLicencePlateTaken(licencePlate: string): Promise<boolean> {
    return this.dataService.execute(this.isLicencePlateTakenAsync(licencePlate));
  }

  private removeAsync(car: Car): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      if (car.key) {
        const carsRef = await this.getCarsRefAsync();
        await carsRef.remove(car.key);
      } else {
        reject('translate.noCar');
      }
    });
  }

  private upsertAsync(car: Car): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (car) {
        if (car.key) {
          this.update(car)
            .then(() => resolve(car.key!))
            .catch(reject);
        } else {
          const key = this.create(car);
          resolve(key);
        }
      } else {
        reject(this.translate.instant('errors.noCarDefined'));
      }
    });
  }

  private isLicencePlateTakenAsync(licencePlate: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const carsRef = await this.getCarsRefAsync();
      const raw = await carsRef.query.orderByChild('licencePlate').equalTo(licencePlate).limitToFirst(1).get();
      const item = raw?.val() as Car;
      resolve(item != null)
    })
  }

  private updateAsync(value: Car): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const key = value.key!;
      const data = this.stripKey(value);
      const carsRef = await this.getCarsRefAsync();
      await carsRef.update(key, data);
      resolve();
    });
  }

  private getCarAsync(key: string): Promise<Observable<Car>> {
    return new Promise<Observable<Car>>(async (resolve) => {
      const path = await this.buildDbPath(key);
      const result = this.db.object<Car>(path)
        .snapshotChanges().pipe(
          map(changes => {
            return (this.reMap(changes.payload, key));
          }));
      resolve(result);
    });
  }

  private searchAsync(searchText?: string): Promise<Observable<Car[]>> {
    return new Promise<Observable<Car[]>>(async (resolve) => {
      const cars = await this.getCarsAsync()
      resolve(cars.pipe(
        map((items: Car[]) => items.filter((item: Car) => item.licencePlate.toLocaleLowerCase().includes(searchText!)))));
    });
  }

  private async buildDbPath(key: string | null = null): Promise<string> {
    const currentUser = await this.auth.getCurrentUser();
    if (currentUser?.uid) {
      const keyValue = key ? `/${key}` : '';
      return `items/${currentUser.uid}/${this.dbPath}${keyValue}`;
    }
    return '';
  }

  private getCarsAsync(): Promise<Observable<Car[]>> {
    return new Promise<Observable<Car[]>>(async (resolve) => {
      const carsRef = await this.getCarsRefAsync();
      resolve(carsRef.snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            (this.reMap(c.payload, 'new'))))
      )
        .pipe(
          map((items: Car[]) => items.filter((item: Car) => item.licencePlate !== ''))
        ))
    });
  }

  private getCarsRefAsync(): Promise<AngularFireList<Car>> {
    return new Promise<AngularFireList<Car>>(async (resolve) => {
      const path = await this.buildDbPath();
      resolve(this.db.list<Car>(path));
    });
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
    result.fixes = data.fixes ?? [];
    result.stk = data.stk;
    return result;
  }

  private async create(car: Car): Promise<string> {
    const carsRef = await this.getCarsRefAsync();
    return carsRef.push(car).key!;
  }

  private stripKey(car: Car): any {
    return {
      licencePlate: car.licencePlate,
      brand: car.brand,
      model: car.model,
      fixes: car.fixes,
      stk: car.stk == undefined ? null : car.stk
    }
  }
}
