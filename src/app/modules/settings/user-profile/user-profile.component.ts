import {Component, OnInit, ViewChild} from '@angular/core';
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {NavigationService} from "../../../services/navigation.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {CommonValidators} from "../../../common/validators/common.validators";
import {HelperService} from "../../../services/helper.service";
import {MessagesService} from "../../../services/messages.service";
import {ChangePasswordDialog} from "./dialogs/change-password/change-password.dialog";
import {PasswordDialog} from "./dialogs/password/password.dialog";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  //template: '<h1>UNDER CONSTRUCTION</h1>',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent extends AfterNavigatedHandler implements OnInit {
  user: any;

  form = new FormGroup({
    'displayName': new FormControl(''),
    'email': new FormControl('', [Validators.required, CommonValidators.firebaseEmail])
  });

  @ViewChild(FormGroupDirective, {static: true}) formGroup!: FormGroupDirective;

  constructor(
    private readonly authService: AuthService,
    private readonly helperService: HelperService,
    private readonly messageService: MessagesService,
    navigation: NavigationService,
    route: ActivatedRoute) {
    super(route, navigation);
  }

  protected override readonly backLinkIfNotPresent = '';

  ngOnInit() {
    this.authService.getCurrentUser().then(user => this.setUser(user));
  }

  onSubmit() {
    if (this.form.valid) {
      this.showPasswordDialog(password => {
        this.authService.changeEmail(this.user!.email, password, this.form.value.email!)
          .then(() => this.messageService.showSuccess({message: 'messages.resendVerificationEmail'}))
          .catch(err => {
            console.log(err);
            this.messageService.showError(err)});
      });
    }
  }

  onChangePassword() {
    const dlg = this.messageService.showCustomDialog(ChangePasswordDialog, {
      title: 'auth.confirmResetPassword.title',
      content: '',
      actions: [
        {
          label: 'buttons.cancel',
          getValue(_: any): any {
            return undefined
          }
        },
        {
          label: 'buttons.ok',
          color: 'primary',
          getValue(newPassword: any): any {
            return newPassword
          },
          getDisabled(value: boolean): boolean {
            return value
          }
        }
      ],
      extraData: {
        password: '',
      }
    });
    dlg.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.authService.changePassword(this.user.email!, result.password, result.newPassword)
          .then(() => this.messageService.showSuccess({message: 'messages.passwordChanged'}))
          .catch(err => this.messageService.showError(err));
      }
    })
  }

  private showPasswordDialog(onGetPassword: (password: any) => void) {
    const dlg = this.messageService.showCustomDialog(PasswordDialog, {
      title: 'auth.confirmResetPassword.title',
      content: '',
      actions: [
        {
          label: 'buttons.cancel',
          getValue(_: any): any {
            return undefined
          }
        },
        {
          label: 'buttons.ok',
          color: 'primary',
          getValue(password: any): any {
            return password
          },
          getDisabled(value: boolean): boolean {
            return value
          }
        }
      ],
      extraData: {
        password: '',
      }
    }, 240);
    dlg.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        onGetPassword(result);
      }
    })
  }

  private setUser(user: any) {
    this.user = user;
    const displayName = this.form.controls['displayName'];
    if (displayName) {
      displayName.patchValue(user.displayName);
    }
    const email = this.form.controls['email'];
    if (email) {
      email.patchValue(user.email);
    }
  }
}
