import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {BaseAfterNavigatedHandler} from "../../../common/BaseAfterNavigatedHandler";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {CarsService} from "../../../services/cars.service";
import {Car} from "../../../models/car";
import {ActivatedRoute} from "@angular/router";
import {Observable, Subscription} from "rxjs";

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
  private snapshotSubscription = new Subscription();

  constructor(private formBuilder: FormBuilder, navigation: NavigationService, private carsService: CarsService, private route: ActivatedRoute) {
    super(navigation);
  }

  ngOnInit() {
    this.snapshotSubscription = this.route.snapshot.data['car'].subscribe((data: Car) => {
      console.log(data);
        if (data && data.key !== undefined) {
          this.carForm.setValue(data as any);
        } else {
          //this.router.navigate(['/cars']).catch();
        }
    });
  }

  ngOnDestroy() {
    this.snapshotSubscription.unsubscribe();
  }

  onSubmit() {
    if (this.carForm.valid) {
      let car = (this.carForm.value as any) as Car;
      if (car && car.licencePlate) {
        this.carsService.upsert(car)
          .then(id => {
            //this.messageService.showMessageWithTranslation(MessageType.Success, 'messages.saved', undefined, true, 0);
            //this.router.navigate([`/cars/detail/${id}`]).catch();
          })
        //.catch(err=>this.messageService.showError(err));
      }
    }
  }

  protected override isMatch(data: any): boolean {
    return data?.startsWith('/cars/detail/new') || data?.startsWith('/cars/detail/edit')
  }

  protected override getActionsData(data: any): ActionsData {
    const result = new ActionsData();
    result.backAction = ActionsData.createBackAction('/cars');
    return result;
  }
}
