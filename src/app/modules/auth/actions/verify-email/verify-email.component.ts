import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {CommonService} from "../../../../services/common.service";
import {MessageService, MessageType} from "../../../../services/message.service";
import {UsersService} from "../../../../services/users.service";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  oobCode: string | null = null;
  userEmail: string;
  private queryParamMapSubscription = new Subscription();
  private redirectUrl: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, public authService: AuthService, private commonService: CommonService, private messageService: MessageService, private userService: UsersService) {
    this.queryParamMapSubscription = this.route.queryParamMap.subscribe(map => this.processQueryParamMap(map));
    this.userEmail = this.userService.currentUser?.email ?? '';
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.queryParamMapSubscription.unsubscribe();
  }

  onSubmit() {
    this.authService.sendVerificationMail()
      .then(() => {
        this.messageService.showMessageWithTranslation(MessageType.Info, 'messages.resendVerificationEmail');
        this.authService.signOut().catch();
      });
  }

  private processQueryParamMap(map: ParamMap) {
    this.oobCode = map.get('oobCode');
    this.redirectUrl = map.get('redirectUrl');
    console.log(this.oobCode);
    if (this.oobCode) {
      this.authService.confirmVerifyEmail(this.oobCode)
        .then(() => {
          this.messageService.showMessageWithTranslation(MessageType.Success, 'messages.emailVerified');
          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]).catch();
          } else {
            this.authService.signOut().catch();
          }
        })
        .catch(err => {
          this.messageService.showError(err);
          this.oobCode = null;
        });
    }

  }
}
