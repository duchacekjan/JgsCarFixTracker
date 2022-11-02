import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from '../models/car';
import { CarsService } from '../services/cars.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  @Input()
  car?: Car | null;
  isNew: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private carsService: CarsService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCar();
  }

  getCar(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.isNew = id === 'new'
    if (this.isNew) {
      this.car = {}
    } else {
      this.carsService.getCar(id)
        .subscribe(data => {
          this.car = data;
        });
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.car?.key) {
      console.log(this.car?.key);
      const data = {
        licencePlate: this.car?.licencePlate,
        brand: this.car?.brand,
        model: this.car?.model
      }
      this.carsService.update(this.car)
        .then(() => this.getCar())
        .catch(err => console.log(err));
    } else {
      if (this.car != undefined) {
        this.carsService.create(this.car)
          .then(() => this.getCar())
      }
    }
  }
}
