import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from "./sign-in/sign-in.component";
import {ActionsComponent} from "./actions/actions.component";

const routes: Routes = [
  {path: 'sign-in', component: SignInComponent},
  {path: 'actions', component: ActionsComponent},
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
