export interface INotification {
  key?: string,
  subject: string,
  body: string,
  created: Date,
  read: string[],
  deleted: string[],
  visibleFrom: Date | null
}

export class NewNotification implements INotification {
  body: string;
  created: Date;
  deleted: string[];
  read: string[];
  subject: string;
  visibleFrom: Date | null;

  constructor(subject: string, body: string, visibleFrom: Date | null = null) {
    this.subject = subject;
    this.body = body;
    this.created = <Date>(new Date().toISOString() as any);
    this.read = [];
    this.deleted = [];
    this.visibleFrom = visibleFrom;
  }

  static FromJgs(notification: JgsNotification): NewNotification {
    return new NewNotification(notification.data.subject, notification.data.body, notification.data.visibleFrom)
  }
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

  get anyRead(): boolean {
    return this.data.read?.length > 0
  }

  isSame(other?: JgsNotification) {
    return this.data.key == other?.data.key;
  }
}
