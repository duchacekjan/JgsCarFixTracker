import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BackLinkResolver} from "../../common/resolvers/back-link.resolver";
import {GeneralSettingsComponent} from "./general/general-settings.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";

const routes: Routes = [
  {path: '', redirectTo: 'general', pathMatch: 'full'},
  {
    path: '',
    children: [
      {path: 'general', component: GeneralSettingsComponent, title: 'settings.general.title'},
      {path: 'user-profile', component: UserProfileComponent, title: 'settings.userProfile.title'},
      {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
    ],
    resolve: {'back-link': BackLinkResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRouterModule {
}
