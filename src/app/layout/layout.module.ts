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

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MaterialModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    exports: [],
    declarations: [
      MainComponent
    ]
  })
  export class LayoutModule { }
