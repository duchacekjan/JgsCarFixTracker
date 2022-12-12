import {AfterViewInit, Component} from '@angular/core';
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

  private oobCode: string = '';

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
    if (this.oobCode !== '') {
      this.verifyCode();
    }
  }

  sendEmail() {
    this.authService.sendVerificationEmail(this.user!.email)
      .then(() => this.messageService.showSuccess({message: 'messages.resendVerificationEmail'}))
      .then(() => this.authService.signOut())
      .then(() => this.router.navigate([''], {relativeTo: this.route, replaceUrl: true}));
  }

  private verifyCode() {
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
