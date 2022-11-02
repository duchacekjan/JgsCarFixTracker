import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Car, CarDto } from '../models/car';
import { CarsService } from '../services/cars.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  @Input()
  car?: CarDto | null;
  isNew: boolean = false;
  private carKey?: string | null;
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
    const id = !this.carKey ? String(this.route.snapshot.paramMap.get('id')) : this.carKey;
    this.isNew = id === 'new'
    if (this.isNew) {
      this.car = {}
    } else {
      this.carsService.getCar(id)
        .subscribe(data => {
          this.car = data;
          this.carKey = data.key;
        });
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.car?.key) {
      this.carsService.update(this.car)
        .then(() => {
          this.getCar();
          window.alert('Saved');
        })
        .catch(err => console.log(err));
    } else {
      if (this.car) {
        this.carKey = this.carsService.create(this.car);
        this.getCar();
        window.alert('Saved');
      }
    }
  }
}
