import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsRouterModule} from "./settings-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material.module";
import {GeneralSettingsComponent} from "./general/general-settings.component";

@NgModule({
  imports: [
    CommonModule,
    SettingsRouterModule,
    TranslateModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [GeneralSettingsComponent]
})
export class SettingsModule {
}
