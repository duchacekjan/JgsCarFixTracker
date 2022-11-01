import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { CarListComponent } from './car-list/car-list.component';
import { CarComponent } from './car/car.component';
import { AuthGuard } from './services/guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth/sign-in', pathMatch: 'full' },
  { path: 'auth/sign-in', component: SignInComponent },
  { path: 'auth/register', component: SignUpComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/verify-email', component: VerifyEmailComponent },
  { path: "cars", component: CarListComponent, canActivate: [AuthGuard] },
  { path: 'cars/detail/:id', component: CarComponent, canActivate: [AuthGuard] },
  { path: 'cars/detail/new', component: CarComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
