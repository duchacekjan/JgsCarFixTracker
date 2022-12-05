import {Component} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NavigationService} from "../../../services/navigation.service";
import {BaseAfterNavigatedHandler} from "../../../common/BaseAfterNavigatedHandler";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends BaseAfterNavigatedHandler {
  user: any;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, navigation: NavigationService) {
    super(navigation);
  }

  ngOnInit(): void {
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

  protected override isMatch(data: any): boolean {
    return data === '/auth/sign-in';
  }
}
