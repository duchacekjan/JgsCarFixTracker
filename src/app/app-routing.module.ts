import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarListComponent } from './car-list/car-list.component';
import { CarComponent } from './car/car.component';

const routes: Routes = [
  { path: "cars", component: CarListComponent },
  { path: '', redirectTo: 'cars', pathMatch: 'full' },
  { path: 'cars/detail/:id', component: CarComponent },
  { path: 'cars/detail/new', component: CarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
