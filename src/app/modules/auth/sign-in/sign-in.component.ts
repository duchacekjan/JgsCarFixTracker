import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NavigationService} from "../../../services/navigation.service";
import {Action} from "../../../models/action";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  user: any;

  private afterNavigatedSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private navigation: NavigationService) {
    this.afterNavigatedSubscription = this.navigation.afterNavigated(data => this.afterNavigated(data));
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.afterNavigatedSubscription.unsubscribe();
  }

  onSignIn() {
    this.authService
      .signIn('jgs.nuget@gmail.com', '123456')
      .then(async user => {
        this.user = user.user?.uid;
        const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl') ?? '/cars';
        await this.router.navigate([redirectUrl], {replaceUrl: true, relativeTo: this.route});
      });
  }

  private afterNavigated(data: any): Action[] | null {
    console.log(`data: ${data}`);
    if (data !== '/auth/sign-in') {
      return null;
    }
    return [];
  }
}
