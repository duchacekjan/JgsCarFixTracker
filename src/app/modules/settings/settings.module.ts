import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsRouterModule} from "./settings-routing.module";
import {SettingsComponent} from "./settings.component";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material.module";

@NgModule({
  imports: [
    CommonModule,
    SettingsRouterModule,
    TranslateModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [SettingsComponent]
})
export class SettingsModule {
}
