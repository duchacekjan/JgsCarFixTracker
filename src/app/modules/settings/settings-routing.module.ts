import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SettingsComponent} from './settings.component';
import {BackLinkResolver} from "../../common/resolvers/back-link.resolver";

const routes: Routes = [
  {path: '', component: SettingsComponent, resolve: {'back-link': BackLinkResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRouterModule {
}
