import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {environment} from "../../environments/environment";
import {INotification, JgsNotification, NewNotification} from "../models/INotification";
import {map, Observable} from "rxjs";
import {MessagesService} from "./messages.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationsRef: AngularFireList<INotification>;

  constructor(private readonly db: AngularFireDatabase, private readonly messageService: MessagesService) {
    const prefix = environment.production ? "" : "test/"
    this.notificationsRef = this.db.list(prefix + "notifications");
  }

  getList(userId?: string, isAdmin: boolean = false): Observable<JgsNotification[]> {
    let now = new Date();
    return this.notificationsRef.snapshotChanges().pipe(
      map(changes => {
          return changes.map(c =>
            (<INotification>{key: c.key, ...c.payload.val()}))
        }
      ),
      map(data => data
        .filter((x: INotification) => isAdmin || !x.deleted?.find(f => f == userId))
        .filter((x: INotification) => isAdmin || !x.visibleFrom || new Date(x.visibleFrom) <= now)),
      map(data => data.map(notification => new JgsNotification(notification, notification.read?.find(f => f == userId) != undefined)))
    );
  }

  create(subject: string, body: string, visibleFrom: Date | null = null) {
    let data = new NewNotification(subject, body, visibleFrom);
    return this.notificationsRef.push(data);
  }

  update(notification: JgsNotification) {
    let data = NewNotification.FromJgs(notification);
    return this.notificationsRef.update(notification.data.key!, data);
  }

  async deleteListAsync(items: INotification[]) {
    for (let item of items) {
      if (!item.key) continue;
      await this.notificationsRef.remove(item.key);
    }
    let message = items.length == 1 ? 'messages.notificationDeleted' : 'messages.notificationListDeleted'
    this.messageService.showSuccess({message: message});
  }

  async markAllAsDeletedAsync(items: INotification[], userId?: string) {
    for (let item of items) {
      await this.setAsDeleted(item, userId);
    }
    let message = items.length == 1 ? 'messages.notificationDeleted' : 'messages.notificationListDeleted'
    this.messageService.showSuccess({message: message});
  }

  async markAllAsReadAsync(items: INotification[], userId?: string) {
    for (let item of items) {
      await this.setAsRead(item, userId);
    }
    let message = items.length == 1 ? 'messages.notificationRead' : 'messages.notificationListRead'
    this.messageService.showSuccess({message: message});
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

  private setAsDeleted(notification: INotification, userId?: string) {
    if (!userId) {
      return Promise.resolve();
    }

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
