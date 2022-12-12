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
  @Input() mode!: string;
  user: any = null;
  canVerify = false;
  title: string = '';
  notVerified: string = '';
  emailSendTo_email: string = '';
  checkEmail: string = '';
  button: string = '';
  buttonVerify: string = '';

  private _oobCode: string = '';
  private get oobCode(): string {
    return this._oobCode;
  };

  private set oobCode(value: string) {
    this._oobCode = value ?? '';
    this.canVerify = this._oobCode !== '';
    const prefix = this.mode === 'verifyEmail'
      ? 'auth.confirmVerifyEmail'
      : 'auth.confirmChangeEmail';
    this.title = prefix + 'title';
    this.notVerified = prefix + 'notVerified';
    this.emailSendTo_email = prefix + 'emailSendTo_email';
    this.checkEmail = prefix + 'checkEmail';
    this.button = prefix + 'button';
    this.buttonVerify = prefix + 'buttonVerify';
  }

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly messageService: MessagesService) {
  }

  ngAfterViewInit() {
    //TODO handle action verifyAndChangeEmail specifically. Update texts, maybe
    this.authService.getCurrentUser().then(user => this.setUser(user));
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode') ?? '';
    console.log(this.oobCode);
  }

  sendEmail() {
    this.authService.sendVerificationEmail(this.user!.email)
      .then(() => this.messageService.showSuccess({message: 'messages.resendVerificationEmail'}))
      .then(() => this.authService.signOut())
      .then(() => this.router.navigate([''], {relativeTo: this.route, replaceUrl: true}));
  }

  verifyCode() {
    this.authService.applyActionCode(this.oobCode)
      .then(() => this.router.navigate([''], {relativeTo: this.route, replaceUrl: true}))
      .catch(err => this.messageService.showError(err));
  }

  private setUser(user: any) {
    setTimeout(() => {
      this.user = user;
    }, 0);
  }
}
