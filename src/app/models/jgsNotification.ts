export interface JgsNotification {
  key?: string,
  subject: string,
  body: string,
  isRead: boolean,
  visibleFrom?: Date
}
