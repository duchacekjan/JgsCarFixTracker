import {Component} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NavigationService} from "../../../services/navigation.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MessagesService} from "../../../services/messages.service";
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends AfterNavigatedHandler {
  signInForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessagesService,
    route: ActivatedRoute,
    navigation: NavigationService) {
    super(route, navigation);
  }

  onSignIn() {
    if (this.signInForm.valid) {
      const value = this.signInForm.value;
      this.authService
        .signIn(value.email ?? '', value.password ?? '')
        .then(async () => {
          await this.navigateToRedirectUrl();
        })
        .catch(err => {
          this.messageService.showError(err);
        });
    }
  }

  protected override afterNavigationEnded() {
    this.authService.isSignedIn().then(async isAuthorized => {
      if (isAuthorized === true) {
        await this.navigateToRedirectUrl();
      } else if (isAuthorized === false) {
        await this.navigateWithoutHistory('/auth/actions', {'mode': 'verifyEmail'});
      }
    })
  }

  private async navigateToRedirectUrl() {
    this.signInForm.reset();
    const redirectUrl = this.getQueryParam('redirectUrl', '/cars');
    console.log(redirectUrl);
    await this.router.navigateByUrl(redirectUrl, {replaceUrl: true});
  }
}
