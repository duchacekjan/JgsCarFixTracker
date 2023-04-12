import {NgModule} from "@angular/core";
import {LayoutComponent} from './layout.component';
import {AppCommonModule} from "../../common/app-common.module";
import {BackLinkResolver} from "../../common/resolvers/back-link.resolver";
import {RouterModule} from "@angular/router";
import {AppLayoutRoutingModule} from "./app-layout-routing.module";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../../material.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateModule} from "@ngx-translate/core";
import {CarDetailResolver} from "../../common/resolvers/car-detail.resolver";
import {MenuComponent} from './menu/menu.component';

@NgModule({
  declarations: [
    LayoutComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
    TranslateModule,
    AppCommonModule,
    RouterModule,
    AppLayoutRoutingModule
  ],
  providers: [
    BackLinkResolver,
    CarDetailResolver
  ]
})

export class AppLayoutModule {
}
