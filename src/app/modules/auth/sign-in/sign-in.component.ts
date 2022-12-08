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

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessagesService,
    navigation: NavigationService) {
    super(navigation);
  }

  ngOnInit(): void {
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

  protected override isMatch(data: any): boolean {
    return data === '/auth/sign-in';
  }

  protected override afterNavigationEnded() {
    this.authService.isSignedIn().then(async isAuthorized => {
      if (isAuthorized === true) {
        await this.navigateToRedirectUrl();
      } else if (isAuthorized === false) {
        await this.router.navigate(['/auth/actions'], {replaceUrl: true, relativeTo: this.route, queryParams: {'mode': 'verifyEmail'}});
      }
    })
  }

  private async navigateToRedirectUrl() {
    this.signInForm.reset();
    const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl') ?? '/cars';
    console.log(redirectUrl);
    await this.router.navigateByUrl(redirectUrl, {replaceUrl: true});
  }
}
