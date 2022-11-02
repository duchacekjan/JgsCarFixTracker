import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { Fix, FixDto } from '../models/fix';

@Injectable({
  providedIn: 'root'
})
export class FixesService {

  private dbPath = '/fixes';
  constructor(private db: AngularFireDatabase) { }

  getFixes(carKey: string): AngularFireList<Fix> {
    return this.db.list(this.dbPath, ref => ref.orderByChild('carKey').equalTo(carKey))
  }

  create(fix: Fix): Observable<FixDto> {
    const carKey = this.getCarKey(fix);
    fix.lastUpdate = new Date();
    const key = this.getFixes(carKey).push(fix).key;
    return this.getFix(key!);
  }

  update(fix: FixDto): Promise<void> {
    const carKey = this.getCarKey(fix);
    const key = fix.key!;
    const data = this.stripKey(fix);
    return this.getFixes(carKey).update(key, data);
  }

  private getFix(key: string): Observable<FixDto> {
    return this.db.object(`${this.dbPath}/${key}`)
      .snapshotChanges().pipe(
        map(changes =>
          ({ key: changes.payload.key, ...changes.payload.val() as FixDto })));
  }

  private getCarKey(fix: Fix): string {
    return fix?.carKey ? fix.carKey : '';
  }

  private stripKey(fix: FixDto): Fix {
    return {
      carKey: fix.carKey,
      mileage: fix.mileage,
      description: fix.description,
      lastUpdate: new Date()
    }
  }
}
