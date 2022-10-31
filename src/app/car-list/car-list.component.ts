import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Car } from '../models/car';
import { AuthService } from '../services/auth.service';
import { CarsService } from '../services/cars.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

  cars?: Car[] = [];
  selectedIndex = -1;
  constructor(private carsService: CarsService, private router: Router,
    public authService: AuthService,
    public usersService: UsersService) { }

  ngOnInit(): void {
    this.retrieveCars();
    this.setActiveNavigation(0);
  }

  retrieveCars(): void {
    this.carsService.getCars().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.cars = data
    });
  }
  refreshList(): void {
    this.retrieveCars();
  }

  addNew(): void {
    this.router.navigate(['/cars/detail/new']);
  }

  setActiveNavigation(index: number) {
    this.selectedIndex = index;
  }
}
