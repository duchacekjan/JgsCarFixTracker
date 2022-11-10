import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Car} from "../../../models/car";
import {ActivatedRoute, Router} from "@angular/router";
import {CarsService} from "../../../services/cars.service";
import {Fix} from "../../../models/fix";

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
  editedIndex: number = -1;
  private carKey: string | null = null;
  private requestedEditIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private carsService: CarsService,
    private router: Router
  ) {
  }

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
          this.carKey = data.key ? data.key : null;
          if (this.requestedEditIndex) {
            this.editedIndex = this.requestedEditIndex;
            this.requestedEditIndex = null;
          }
        });
    }
  }

  save(car: Car): void {
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

  saveFix(fix: Fix) {
    if (this.car?.fixes) {
      const index = this.car.fixes.indexOf(fix);
      console.log(index);
      let newIndex = -1;
      fix.lastUpdate = new Date();
      if (index > -1) {
        newIndex = -1;
      } else {
        newIndex = this.car.fixes.push(fix) - 1;
      }
      if (this.car.key) {
        this.carsService.update(this.car)
          .then(() => {
            this.requestedEditIndex = newIndex;
          })
          .catch(err => console.log(err));
      }
    }
  }

  editFix(index: number) {
    if (this.car?.fixes && this.car.fixes.length > 0 && index >= 0 && index <= this.car.fixes.length - 1) {
      this.editedIndex = index;
    } else {
      this.editedIndex = -1;
    }
  }
}
