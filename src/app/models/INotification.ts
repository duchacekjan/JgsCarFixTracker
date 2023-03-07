import {formatTime} from "../common/jgs-common-functions";

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

  get created(): string {
    let today = new Date(new Date().toDateString());
    let createdDateTime = new Date(this.data.created);
    let created = new Date(createdDateTime.toDateString());
    if (created < today) {
      return created.toLocaleDateString();
    } else {
      return formatTime(createdDateTime);
    }
  }
}
