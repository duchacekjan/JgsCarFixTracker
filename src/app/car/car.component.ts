import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarDto } from '../models/car';
import { CarsService } from '../services/cars.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  car: CarDto = {
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
  ) { 
    console.log(this.carsService);
  }

  ngOnInit(): void {
    this.getCar();
  }

  getCar(): void {
    const id = this.carKey ? this.carKey : String(this.route.snapshot.paramMap.get('id'));
    this.isNew = id === 'new'
    if (this.isNew) {
      this.car 
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

  save(car: CarDto): void {
    console.log('Save called');
    this.carsService.upsert(car)
    .then(key=>{
      if(this.carKey===key){
        this.getCar();
          window.alert('Saved');
      }else{
        this.carKey = key;
        this.router.navigate([`/cars/detail/${this.carKey}`], { replaceUrl: true });
        this.getCar();
      }
    })
    .catch(err=>console.log(err));
  }
}
