import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {NavigationService} from "../../../services/navigation.service";
import {CarsService} from "../../../services/cars.service";
import {Car} from "../../../models/car";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {MessagesService} from "../../../services/messages.service";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";

@Component({
  selector: 'app-car-detail-form',
  templateUrl: './car-detail-form.component.html',
  styleUrls: ['./car-detail-form.component.scss']
})
export class CarDetailFormComponent extends AfterNavigatedHandler implements OnInit, OnDestroy {
  isNew = false;

  carForm = this.formBuilder.group({
    licencePlate: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
    brand: '',
    model: '',
    fixes: [],
    key: '',
    stk: null
  });//async validator for licencePlate
  private carSubscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private carsService: CarsService,
    route: ActivatedRoute,
    private router: Router,
    private messageService: MessagesService,
    navigation: NavigationService) {
    super(route, navigation);
  }

  protected override readonly backLinkIfNotPresent: string = '/cars';

  ngOnInit() {
    this.isNew = this.route.snapshot.data['is-new'];
    this.carSubscription = this.route.snapshot.data['car'].subscribe((data: Car) => {
      if (data && data.key !== undefined) {
        if (data.stk === undefined) {
          data.stk = null;
        }
        this.carForm.setValue(data as any);
      } else {
        this.messageService.showError({message: this.isNew ? 'cars.detail.errorCreate' : 'cars.detail.notFound'});
        this.router.navigate(['/cars']).catch();
      }
    });
  }

  ngOnDestroy() {
    this.carSubscription.unsubscribe();
  }

  onSubmit() {
    if (this.carForm.valid) {
      let car = (this.carForm.value as any) as Car;
      if (car && car.licencePlate) {
        this.carsService.upsert(car)
          .then(id => {
            this.messageService.showSuccess({message: 'messages.saved'});
            this.router.navigate([`/cars/${id}`]).catch();
          })
          .catch(err => this.messageService.showError(err));
      }
    }
  }
}
