import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Car } from '../models/car';
import { CarsService } from '../services/cars.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

  cars?: Car[] = [];
  constructor(private carsService: CarsService, private router: Router) { }

  ngOnInit(): void {
    this.retrieveCars();
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

  addNew():void{
    this.router.navigate(['/cars/detail/new']);
  }
}
