import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit, OnDestroy {

  private queryParamMapSubscription = new Subscription();

  mode: string = '';

  constructor(private activatedRoute: ActivatedRoute) {
    this.queryParamMapSubscription = activatedRoute.queryParamMap.subscribe(map => this.processQueryParamMap(map));
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.queryParamMapSubscription.unsubscribe();
  }

  private processQueryParamMap(map: ParamMap) {
    this.mode = map.get('mode') ?? '';
  }
}
