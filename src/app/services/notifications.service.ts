import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {environment} from "../../environments/environment";
import {JgsNotification} from "../models/jgsNotification";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationsRef: AngularFireList<JgsNotification>;

  constructor(private readonly db: AngularFireDatabase) {
    const prefix = environment.production ? "" : "test/"
    this.notificationsRef = this.db.list(prefix + "notifications");
  }

  getList(): Observable<JgsNotification[]> {
    let now = new Date();
    return this.notificationsRef.snapshotChanges().pipe(
      map(changes => {
          return changes.map(c =>
            (<JgsNotification>{key: c.key, ...c.payload.val()}))
        }
      ),
      map(data => data.filter((x: JgsNotification) => !x.visibleFrom || new Date(x.visibleFrom) <= now))
    );
  }

  setAsRead(notification: JgsNotification) {
    if (!notification.key) {
      return Promise.resolve();
    }

    notification.isRead = false;
    let data = {
      subject: notification.subject,
      body: notification.body,
      isRead: notification.isRead,
      visibleFrom: notification.visibleFrom
    }
    return this.notificationsRef.update(notification.key, data);
  }

  delete(notification: JgsNotification) {
    if (!notification.key) {
      return Promise.resolve();
    }

    return this.notificationsRef.remove(notification.key);
  }
}
