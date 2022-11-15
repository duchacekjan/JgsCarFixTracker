import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {debounceTime, switchMap} from 'rxjs/operators';
import {Car} from 'src/app/models/car';
import {CarsService} from 'src/app/services/cars.service';
import {Subject, Subscription} from "rxjs";

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

  constructor(private carsService: CarsService, private router: Router) {
  }

  ngOnInit(): void {
    this.searchSubscription = this.searchedText.pipe(
      debounceTime(300),
      switchMap((searchQuery: string) => this.carsService.search(searchQuery)))
      .subscribe((results) => (this.cars = results));
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  addNew(): void {
    this.redirectToCarDetail();
  }

  navigate(carKey?: string) {
    if (carKey) {
      this.redirectToCarDetail(carKey);
    }
  }

  private redirectToCarDetail(carKey: string = 'new') {
    this.router.navigate([`/cars/detail/${carKey}`]);
  }

  onSearchInputChanged(input: string) {
    this.searchedText.next(input);
  }
}
