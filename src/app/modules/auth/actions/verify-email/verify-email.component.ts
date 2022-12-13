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
  firstTime: boolean = true;
  private readonly visitorsKey = 'verifyEmailVisitors';
  private visitors: string[] = [];

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
      .then(() => {
        const index = this.visitors.indexOf(this.user.uid);
        if (index < 0) {
          this.visitors.push(this.user.uid);
          localStorage.setItem(this.visitorsKey, JSON.stringify(this.visitors));
        }
      })
      .then(() => this.authService.signOut())
      .then(() => this.router.navigate(['/auth/sign-in'], {relativeTo: this.route, replaceUrl: true}))
      .catch(err => this.messageService.showError(err));
  }

  private verifyCode(oobCode: string) {
    this.authService.applyActionCode(oobCode)
      .then(() => {
        const index = this.visitors.indexOf(this.user.uid);
        if (index > -1) {
          this.visitors.splice(index, 1);
          localStorage.setItem(this.visitorsKey, JSON.stringify(this.visitors));
        }
      })
      .then(() => this.messageService.showSuccess({message: 'messages.emailVerified'}))
      .then(() => this.router.navigate(['/cars'], {relativeTo: this.route, replaceUrl: true}))
      .catch(err => this.messageService.showError(err));
  }

  private setUser(user: any) {
    setTimeout(() => {
      this.user = user;
      const value = localStorage.getItem(this.visitorsKey);
      console.log('local');
      console.log(value);
      if (value) {
        this.visitors = JSON.parse(value);
        if (this.visitors.includes(this.user.uid)) {
          this.firstTime = false;
        }
      }
    }, 0);
  }
}
