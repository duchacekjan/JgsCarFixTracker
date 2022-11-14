import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {Car} from 'src/app/models/car';
import {CarsService} from 'src/app/services/cars.service';
import {Observable} from "rxjs";

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})

export class CarListComponent implements OnInit {

  cars: Observable<Car[]>;

  constructor(private carsService: CarsService, private router: Router) {
    this.cars = this.carsService.getCars();
  }

  ngOnInit(): void {
  }

  retrieveCars(): void {
  }

  addNew(): void {
    this.redirectToCarDetail();
  }

  navigate(carKey?: string) {
    if (carKey) {
      this.redirectToCarDetail(carKey);
    }
  }

  private redirectToCarDetail(carKey: string = 'new') {
    this.router.navigate([`/cars/detail/${carKey}`]);
  }
}
