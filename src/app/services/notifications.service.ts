import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {environment} from "../../environments/environment";
import {INotification, JgsNotification} from "../models/INotification";
import {map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationsRef: AngularFireList<INotification>;

  constructor(private readonly db: AngularFireDatabase) {
    const prefix = environment.production ? "" : "test/"
    this.notificationsRef = this.db.list(prefix + "notifications");
  }

  getList(userId?: string): Observable<JgsNotification[]> {
    let now = new Date();
    return this.notificationsRef.snapshotChanges().pipe(
      map(changes => {
          return changes.map(c =>
            (<INotification>{key: c.key, ...c.payload.val()}))
        }
      ),
      map(data => data
        .filter((x: INotification) => !x.deleted.find(f => f == userId))
        .filter((x: INotification) => !x.visibleFrom || new Date(x.visibleFrom) <= now)),
      map(data => data.map(notification => new JgsNotification(notification, notification.read.find(f => f == userId) != undefined)))
    );
  }

  setAsRead(notification: INotification, userId?: string) {
    if (!userId) {
      return Promise.resolve();
    }
    if (!notification.key) {
      return Promise.resolve();
    }

    if (!notification.read) {
      notification.read = [];
    }
    if (notification.read.find(f => f == userId)) {
      return Promise.resolve();
    }

    notification.read.push(userId);
    let data = {
      read: notification.read
    }
    return this.notificationsRef.update(notification.key, data);
  }

  serAsDeleted(notification: INotification, userId: string) {
    if (!notification.key) {
      return Promise.resolve();
    }

    if (!notification.deleted) {
      notification.deleted = [];
    }
    if (notification.deleted.find(f => f == userId)) {
      return Promise.resolve();
    }

    notification.deleted.push(userId);
    let data = {
      deleted: notification.deleted
    }
    return this.notificationsRef.update(notification.key, data);
  }
}
