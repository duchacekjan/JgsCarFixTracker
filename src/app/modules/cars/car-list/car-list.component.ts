import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../../services/data.service";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {Action} from "../../../models/action";
import {Observable, Subject, Subscription, switchMap} from "rxjs";
import {Car} from "../../../models/car";
import {CarsService} from "../../../services/cars.service";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {search} from "../../../common/jgs-common-functions";

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent extends AfterNavigatedHandler implements OnDestroy, AfterViewInit {
  cars?: Observable<Car[]>;
  searchText: string = '';
  private searchedText = new Subject<string>();
  private searchSubscription = new Subscription();

  constructor(route: ActivatedRoute, private authService: AuthService, private router: Router, private dataService: DataService, navigation: NavigationService, public carsService: CarsService) {
    super(route, navigation);
  }

  ngOnDestroy(): void {
    this.searchedText.complete();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.searchSubscription = this.searchedText.pipe(
      search({minLength: 0}),
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
    this.router.navigate([`/cars/${carKey}`]).catch();
  }

  protected override getActionsData(): ActionsData | null {
    const addAction = new Action('add_box');
    addAction.route = '/cars/new';
    addAction.tooltip = 'cars.detail.new.actionHint';

    const result = super.getDefaultActionsData();
    result.actions = [addAction]
    return result;
  }
}
