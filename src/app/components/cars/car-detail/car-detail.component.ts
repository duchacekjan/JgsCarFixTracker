import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Car} from "../../../models/car";
import {ActivatedRoute, Router} from "@angular/router";
import {CarsService} from "../../../services/cars.service";

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit {

  car: Car = {
    brand: '',
    model: '',
    fixes: []
  };
  isNew: boolean = false;
  private carKey: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private carsService: CarsService,
    private location: Location,
    private router: Router
  ) {  }

  ngOnInit(): void {
    this.getCar();
  }

  getCar(): void {
    const id = this.carKey ? this.carKey : String(this.route.snapshot.paramMap.get('id'));
    this.isNew = id === 'new'
    if (this.isNew) {
      this.car = {
        brand: '',
        model: '',
        fixes: []
      };
    } else {
      this.carsService.getCar(id)
        .subscribe(data => {
          this.car = data;
          console.log(`Car: ${this.car?.key}`)
          if (!this.car.fixes) {
            this.car.fixes = [];
          }
          this.carKey = data.key ? data.key : null;
        });
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(car: Car): void {
    console.log('Save called');
    this.carsService.upsert(car)
      .then(key => {
        if (this.carKey === key) {
          this.getCar();
          window.alert('Saved');
        } else {
          this.carKey = key;
          this.router.navigate([`/cars/detail/${this.carKey}`], {replaceUrl: true})
            .then(() => {
              this.getCar();
            });
        }
      })
      .catch(err => console.log(err));
  }
}
