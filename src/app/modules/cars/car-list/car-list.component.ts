import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Car} from 'src/app/models/car';
import {CarsService} from 'src/app/services/cars.service';
import {Subject, Subscription} from "rxjs";
import {ActionsService} from "../../../services/actions.service";
import {MessageService} from "../../../services/message.service";
import {TranslateService} from "@ngx-translate/core";
import {Action} from "../../../models/action";

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})

export class CarListComponent implements OnInit {

  cars: Car[] = [];
  searchText: string = '';
  private searchedText = new Subject<string>();
  private searchSubscription = new Subscription();
  private queryParamSubscription: Subscription;

  constructor(private carsService: CarsService, private router: Router, private actionsService: ActionsService, private route: ActivatedRoute, private messages: MessageService, private translate: TranslateService) {
    this.queryParamSubscription = route.queryParamMap.subscribe(s => {
      if (s.get('notFound') == '') {
        this.messages.showError(translate.instant('errors.notFound'));
      }
    });
    this.actionsService.clear();
    const addAction = new Action('add_box');
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
    this.queryParamSubscription.unsubscribe();
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
