export interface Notification {
  key?: string,
  subject: string,
  body: string,
  isRead: boolean,
  visibleFrom?: Date,
  visibleTo?: Date
}
