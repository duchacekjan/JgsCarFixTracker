import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {LayoutRoutingModule} from "./layout-routing.module";
import {MainComponent} from "./main/main.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ],
    exports: [],
    declarations: [
      MainComponent
    ]
  })
  export class LayoutModule { }
