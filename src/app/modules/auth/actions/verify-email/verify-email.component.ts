import {AfterViewInit, Component, Input} from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessagesService} from "../../../../services/messages.service";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements AfterViewInit {
  user: any = null;

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly messageService: MessagesService) {
  }

  ngAfterViewInit() {
    this.authService.getCurrentUser().then(user => this.setUser(user));
    const oobCode = this.route.snapshot.queryParamMap.get('oobCode') ?? '';
    console.log(oobCode);
    if (oobCode !== '') {
      this.verifyCode(oobCode);
    }
  }

  sendEmail() {
    this.authService.sendVerificationEmail(this.user!.email)
      .then(() => this.messageService.showSuccess({message: 'messages.resendVerificationEmail'}))
      .then(() => this.authService.signOut())
      .then(() => this.router.navigate([''], {relativeTo: this.route, replaceUrl: true}));
  }

  private verifyCode(oobCode: string) {
    this.authService.applyActionCode(oobCode)
      .then(() => this.messageService.showSuccess('messages.emailVerified'))
      .then(() => this.router.navigate([''], {relativeTo: this.route, replaceUrl: true}))
      .catch(err => this.messageService.showError(err));
  }

  private setUser(user: any) {
    setTimeout(() => {
      this.user = user;
    }, 0);
  }
}
