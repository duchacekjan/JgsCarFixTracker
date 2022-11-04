import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarsModule } from '../components/cars/cars.module';
import { UsersModule } from '../components/users/users.module';
import { MainComponent } from './main/main.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            { path: 'users', loadChildren: () => UsersModule },
            { path: 'cars', loadChildren: () => CarsModule }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
