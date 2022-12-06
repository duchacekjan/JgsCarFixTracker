import {Component} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NavigationService} from "../../../services/navigation.service";
import {BaseAfterNavigatedHandler} from "../../../common/BaseAfterNavigatedHandler";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MessagesService} from "../../../services/messages.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends BaseAfterNavigatedHandler {
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
        .then(async user => {
          this.signInForm.reset();
          const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl') ?? '/cars';
          await this.router.navigate([redirectUrl], {replaceUrl: true, relativeTo: this.route});
        })
        .catch(err => {
          this.messageService.showError(err);
          this.router.navigate(['/cars']).catch(err => this.messageService.showError(err));
        });
    }
  }

  protected override isMatch(data: any): boolean {
    return data === '/auth/sign-in';
  }
}
