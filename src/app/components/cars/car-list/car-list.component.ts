import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Car} from 'src/app/models/car';
import {CarsService} from 'src/app/services/cars.service';
import {Subject, Subscription} from "rxjs";
import {TopBarActionsService} from "../../../services/top-bar-actions.service";
import {TopBarAction} from "../../../models/TopBarAction";

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})

export class CarListComponent implements OnInit {

  cars: Car[] = [];
  searchText: string = '';
  private searchedText = new Subject<string>();
  private searchSubscription = new Subscription();

  constructor(private carsService: CarsService, private router: Router, private actionsService: TopBarActionsService) {
    this.actionsService.clear();
    const addAction = new TopBarAction('add_box');
    addAction.route = '/cars/detail/new';
    addAction.tooltip = 'toolbar.newCar';
    this.actionsService.add(addAction);
    this.actionsService.updateActions();
  }

  ngOnInit(): void {
    this.searchSubscription = this.searchedText.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchQuery: string) => this.carsService.search(searchQuery)))
      .subscribe((results) => (this.cars = results));

    this.searchedText.next('');
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  navigate(carKey?: string | null) {
    if (carKey) {
      this.redirectToCarDetail(carKey);
    }
  }

  private redirectToCarDetail(carKey: string = 'new') {
    this.router.navigate([`/cars/detail/${carKey}`]).catch();
  }

  onSearchInputChanged(input: string) {
    this.searchedText.next(input);
  }
}
