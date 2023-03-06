import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsRouterModule} from "./settings-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material.module";
import {GeneralSettingsComponent} from "./general/general-settings.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {ChangePasswordDialog} from "./user-profile/dialogs/change-password/change-password.dialog";
import {PasswordDialog} from "./user-profile/dialogs/password/password.dialog";
import {ChangeEmailDialog} from "./user-profile/dialogs/change-email/change-email.dialog";

@NgModule({
    imports: [
        CommonModule,
        SettingsRouterModule,
        TranslateModule,
        ReactiveFormsModule,
        MaterialModule,
        FormsModule
    ],
  declarations: [
    GeneralSettingsComponent,
    UserProfileComponent,
    ChangePasswordDialog,
    ChangeEmailDialog,
    PasswordDialog
  ]
})
export class SettingsModule {
}
