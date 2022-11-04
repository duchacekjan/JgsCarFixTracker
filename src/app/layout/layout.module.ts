import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { LayoutRoutingModule } from "./layout-routing.module";
import { MainComponent } from "./main/main.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

@NgModule({
    imports: [
      CommonModule,
      LayoutRoutingModule
    ],
    exports: [],
    declarations: [
      MainComponent,
      HeaderComponent,
      SidebarComponent
    ]
  })
  export class LayoutModule { }