import {Component, OnInit, ViewChild} from '@angular/core';
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {NavigationService} from "../../../services/navigation.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {CommonValidators} from "../../../common/validators/common.validators";
import {HelperService} from "../../../services/helper.service";
import {MessagesService} from "../../../services/messages.service";

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
    this.messageService.showError({message:'messages.notImplemented'});
  }

  onChangePassword() {
    this.messageService.showError({message:'messages.notImplemented'});
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
