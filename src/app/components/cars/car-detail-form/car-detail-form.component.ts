import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CarsService} from "../../../services/cars.service";
import {TopBarActionsService} from "../../../services/top-bar-actions.service";
import {TopBarAction} from "../../../models/TopBarAction";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Car} from "../../../models/car";
import {Fix} from "../../../models/fix";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../snack-bar/snack-bar.component";

@Component({
  selector: 'app-car-detail-form',
  templateUrl: './car-detail-form.component.html',
  styleUrls: ['./car-detail-form.component.css']
})
export class CarDetailFormComponent implements OnInit, OnDestroy {

  isNew = false;

  carForm = this.formBuilder.group({
    licencePlate: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
    brand: '',
    model: '',
    fixes: [],
    key: ''
  });

  private queryParamsSubscription: Subscription

  constructor(private route: ActivatedRoute, private carsService: CarsService, private router: Router, private actionsService: TopBarActionsService, private formBuilder: FormBuilder, private snackBar: MatSnackBar) {
    this.queryParamsSubscription = this.route.queryParamMap.subscribe(s => this.getCar(s.get('id')));
    this.updateActions();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }

  onSubmit() {
    if (this.carForm.valid) {
      let car = (this.carForm.value as any) as Car;
      if (car && car.licencePlate) {
        this.carsService.upsert(car)
          .then(id => {
            this.router.navigate([`/cars/detail/${id}`]).catch();
          })
          .catch(err => {
            this.snackBar.open(';', 'test');
            this.snackBar.openFromComponent(SnackBarComponent, {
              data: {
                message: err,
                action: 'OK'
              },
              duration: 3000,
              panelClass: ['mat-toolbar', 'mat-warn']
            })
          });
      }
    }
  }

  private getCar(id: string | null): void {
    console.log(id);
    this.isNew = id === null;
    this.carsService.getCar(id ?? 'new')
      .subscribe(data => {
        if (data && data.key !== undefined) {
          this.carForm.setValue(data as any);
        } else {
          this.router.navigate(['/cars']).catch();
        }
      });
  }

  private updateActions() {
    this.actionsService.clear();
    this.actionsService.showBackAction();
    this.actionsService.updateActions();
  }
}