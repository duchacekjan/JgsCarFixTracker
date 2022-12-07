import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {BaseAfterNavigatedHandler} from "../../../common/BaseAfterNavigatedHandler";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {CarsService} from "../../../services/cars.service";
import {Car} from "../../../models/car";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {MessagesService} from "../../../services/messages.service";

@Component({
  selector: 'app-car-detail-form',
  templateUrl: './car-detail-form.component.html',
  styleUrls: ['./car-detail-form.component.scss']
})
export class CarDetailFormComponent extends BaseAfterNavigatedHandler implements OnInit, OnDestroy {
  isNew = false;

  carForm = this.formBuilder.group({
    licencePlate: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
    brand: '',
    model: '',
    fixes: [],
    key: ''
  });//async validator for licencePlate
  private carSubscription = new Subscription();
  private backLink: string = '/cars';

  constructor(
    private formBuilder: FormBuilder,
    private carsService: CarsService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessagesService,
    navigation: NavigationService) {
    super(navigation);
  }

  ngOnInit() {
    this.carSubscription = this.route.snapshot.data['car'].subscribe((data: Car) => {
      console.log(data);
      if (data && data.key !== undefined) {
        this.carForm.setValue(data as any);
      } else {
        this.router.navigate(['/cars']).catch();
      }
    });
    this.isNew = this.route.snapshot.data['is-new'];
    this.backLink = this.route.snapshot.data['back-link'];
    console.log('init')
    console.log(this.backLink);
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
            this.router.navigate([`/cars/detail/${id}`]).catch();
          })
          .catch(err => this.messageService.showError(err));
      }
    }
  }

  protected override isMatch(data: any): boolean {
    return data?.startsWith('/cars/detail/new') || data?.startsWith('/cars/detail/edit')
  }

  protected override getActionsData(data: any): ActionsData {
    console.log('actionsdata');
    const result = new ActionsData();
    result.backAction = ActionsData.createBackAction(this.backLink);
    console.log(result.backAction)
    return result;
  }
}
