import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {assignMenuItem, MenuItem} from "../models/menuItem";
import {map, Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuItemsRef: AngularFireList<MenuItem>;

  constructor(private readonly db: AngularFireDatabase) {
    const prefix = environment.production ? "" : "test/"
    this.menuItemsRef = db.list<MenuItem>(prefix + "menu");
  }

  getAllItems(): Observable<MenuItem[]> {
    return this.menuItemsRef.snapshotChanges().pipe(
      map(changes => {
          return changes.map(c => assignMenuItem(c))
        }
      ))
  }

  getItems(user: any): Observable<MenuItem[]> {
    return this.getAllItems()
      .pipe(
        map(items => {
          if (user) {
            return items.filter(i => i.allowed.length == 0 || i.allowed.some(s => s == user.uid))
          } else {
            return [];
          }
        })
      );
  }

  getIsMenuActive(user: any): Observable<boolean> {
    return this.getItems(user)
      .pipe(
        map(p => {
          return p.length > 1
        })
      );
  }

  createOrUpdate(data: MenuItem) {
    let strippedData = {
      name: data.name,
      icon: data.icon,
      route: data.route,
      tooltip: data.tooltip,
      allowed: data.allowed
    }
    if (data.key) {
      return this.menuItemsRef.update(data.key, strippedData);
    } else {
      return this.menuItemsRef.push(strippedData);
    }
  }

  delete(data: MenuItem) {
    return this.menuItemsRef.remove(data.key);
  }
}
