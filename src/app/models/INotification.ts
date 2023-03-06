export interface INotification {
  key?: string,
  subject: string,
  body: string,
  read: string[],
  deleted: string[],
  visibleFrom?: Date
}

export class JgsNotification {
  data: INotification;
  private readonly _isRead: boolean;

  constructor(notification: INotification, isRead: boolean) {
    this.data = notification;
    this._isRead = isRead;
  }

  get isRead(): boolean {
    return this._isRead;
  }
}
