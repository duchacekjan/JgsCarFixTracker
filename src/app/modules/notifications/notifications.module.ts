import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NotificationsRoutingModule} from "./notifications-routing.module";
import {NotificationsListComponent} from './notifications-list/notifications-list.component';
import {NotificationsAdminComponent} from './notifications-admin/notifications-admin.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NotificationsRoutingModule
  ],
  declarations: [
    NotificationsListComponent,
    NotificationsAdminComponent,
    NotificationsListComponent
  ]
})

export class NotificationsModule {
}
