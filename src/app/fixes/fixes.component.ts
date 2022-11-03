import { Component, Input, OnInit } from '@angular/core';
import { CarDto } from '../models/car';
import { FixDto } from '../models/fix';
import { CarsService } from '../services/cars.service';

@Component({
  selector: 'app-fixes',
  templateUrl: './fixes.component.html',
  styleUrls: ['./fixes.component.css']
})
export class FixesComponent implements OnInit {

  @Input()
  car?: CarDto;
  editedIndex: number = -1;
  constructor(private carsService: CarsService) { }

  ngOnInit(): void {
  }

  createFix(): void {
    if (!this.car) {
      return;
    }
    if (!this.car.fixes) {
      console.log('CREATED');
      this.car.fixes = [];
    }

    const fix: FixDto = {
      mileage: this.car.fixes.length > 0 ? Math.max(...this.car.fixes.map(({ mileage }) => mileage ? mileage : 0)) + 1 : 0,
      description: '',
      lastUpdate: new Date()
    };

    this.editedIndex = this.car.fixes.push(fix)-1;
  }

  editFix(index: number): void {
    this.editedIndex = index;
  }

  saveFix(): void {
    if (this.editedIndex > -1 && this.car?.fixes) {
      const fix = this.car.fixes[this.editedIndex];
      if (fix) {
        fix.lastUpdate = new Date();
        this.carsService.upsert(this.car)
          .then(() => {
            this.editedIndex = -1;
          })
          .catch(err => console.log(err));
      } else {
        this.editedIndex = -1;
      }
    }
  }
}
