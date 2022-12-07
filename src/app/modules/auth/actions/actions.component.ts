import {Component, OnInit} from '@angular/core';
import {BaseAfterNavigatedHandler} from "../../../common/BaseAfterNavigatedHandler";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent extends BaseAfterNavigatedHandler implements OnInit {

  mode: string = '';

  constructor(
    navigation: NavigationService,
    private readonly route: ActivatedRoute) {
    super(navigation);
  }

  ngOnInit() {
    this.mode = this.route.snapshot.queryParamMap.get('mode') ?? '';
  }

  protected override isMatch(data: any): boolean {
    return data?.startsWith('/auth/actions');
  }
}
