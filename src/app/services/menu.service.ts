import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {DataService} from "./data.service";
import {MenuItem} from "../models/menuItem";
import {map, Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuItemsRef: AngularFireList<MenuItem>;

  constructor(private readonly db: AngularFireDatabase, private readonly dataService: DataService) {
    const prefix = environment.production ? "" : "test/"
    this.menuItemsRef = db.list<MenuItem>(prefix + "menu");
  }

  getItems(): Observable<MenuItem[]> {
    return this.menuItemsRef.snapshotChanges().pipe(
      map(changes => {
          return changes.map(c =>
            (<MenuItem>{key: c.key, ...c.payload.val()}))
        }
      ));
  }
}
