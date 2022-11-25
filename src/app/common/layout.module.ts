import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {LayoutRoutingModule} from "./layout-routing.module";
import {MainComponent} from "./main/main.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MaterialModule} from "../material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {SnackBarComponent} from "./snack-bar/snack-bar.component";
import {DialogComponent} from "./dialog/dialog.component";

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    exports: [],
    declarations: [
      MainComponent, SnackBarComponent, DialogComponent
    ]
  })
  export class LayoutModule { }
