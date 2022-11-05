import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthModule } from '../components/auth/auth.module';
import { CarsModule } from '../components/cars/cars.module';
import { UsersModule } from '../components/users/users.module';
import { AuthGuard } from '../services/guard/auth.guard';
import { MainComponent } from './main/main.component';

const routes: Routes = [
    {
        path: '', redirectTo: 'cars', pathMatch: 'full'
    },
    {
        path: '',
        component: MainComponent,
        children: [
            { path: 'users', loadChildren: () => UsersModule, canActivate: [AuthGuard] },
            { path: 'cars', loadChildren: () => CarsModule, canActivate: [AuthGuard] },
            { path: 'auth', loadChildren: () => AuthModule }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
