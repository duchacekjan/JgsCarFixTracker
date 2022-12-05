import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {DataService} from "../../../services/data.service";
import {BaseAfterNavigatedHandler} from "../../../common/BaseAfterNavigatedHandler";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {Action} from "../../../models/action";
import {debounceTime, distinctUntilChanged, Observable, Subject, Subscription, switchMap} from "rxjs";
import {Car} from "../../../models/car";
import {CarsService} from "../../../services/cars.service";

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent extends BaseAfterNavigatedHandler implements OnDestroy, AfterViewInit {
  cars?: Observable<Car[]>;
  searchText: string = '';
  private searchedText = new Subject<string>();
  private searchSubscription = new Subscription();

  constructor(private authService: AuthService, private router: Router, private dataService: DataService, navigation: NavigationService, private carsService: CarsService) {
    super(navigation);
  }

  ngOnDestroy(): void {
    this.searchedText.complete();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.searchSubscription = this.searchedText.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(async (searchQuery: string) => await this.carsService.search(searchQuery)))
      .subscribe((results) => (this.cars = results));

    this.searchedText.next('');
  }

  onSearchInputChanged(input: string) {
    this.searchedText.next(input);
  }

  navigate(carKey?: string | null) {
    if (carKey) {
      this.redirectToCarDetail(carKey);
    }
  }

  private redirectToCarDetail(carKey: string = 'new') {
    this.router.navigate([`/cars/detail/${carKey}`]).catch();
  }

  protected override getActionsData(data: any): ActionsData {
    const addAction = new Action('add_box');
    addAction.route = '/cars/detail/new';
    addAction.tooltip = 'toolbar.newCar';

    const result = new ActionsData();
    result.actions = [addAction]
    return result;
  }

  protected override isMatch(data: any): boolean {
    return data === '/cars';
  }
}
