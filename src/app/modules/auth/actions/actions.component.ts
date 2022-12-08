import {Component, OnInit} from '@angular/core';
import {NavigationService} from "../../../services/navigation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent extends AfterNavigatedHandler implements OnInit {

  mode: string = '';

  constructor(
    navigation: NavigationService,
    private readonly authService: AuthService,
    route: ActivatedRoute,
    private readonly router: Router) {
    super(route, navigation);
  }

  ngOnInit() {
    this.mode = this.route.snapshot.queryParamMap.get('mode') ?? '';
  }

  onLinkClick() {
    this.authService.signOut()
      .then(() => {
        this.router.navigate(['/auth/sign-in'], {replaceUrl: true, relativeTo: this.route}).then();
      });
  }
}
