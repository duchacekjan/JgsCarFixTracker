import {Pipe, PipeTransform} from "@angular/core";
import {formatNotificationDate, formatTime} from "./jgs-common-functions";

@Pipe({name: 'notificationDate'})
export class NotificationDatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let today = new Date(new Date().toDateString());
    let createdDateTime = new Date(value);
    let created = new Date(createdDateTime.toDateString());
    if (created < today) {
      return formatNotificationDate(created);
    } else {
      return formatTime(createdDateTime);
    }
  }

}
