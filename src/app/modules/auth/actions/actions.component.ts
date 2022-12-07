import {Component, OnInit} from '@angular/core';
import {BaseAfterNavigatedHandler} from "../../../common/BaseAfterNavigatedHandler";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent extends BaseAfterNavigatedHandler implements OnInit {

  mode: string = '';

  constructor(
    navigation: NavigationService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
    super(navigation);
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

  protected override isMatch(data: any): boolean {
    return data?.startsWith('/auth/actions');
  }
}
