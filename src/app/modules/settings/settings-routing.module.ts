import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BackLinkResolver} from "../../common/resolvers/back-link.resolver";
import {GeneralSettingsComponent} from "./general/general-settings.component";

const routes: Routes = [
  {path: '', component: GeneralSettingsComponent, resolve: {'back-link': BackLinkResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRouterModule {
}
