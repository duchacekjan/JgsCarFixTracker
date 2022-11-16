import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {TopBarActionsService} from "../../../services/top-bar-actions.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  autoLogin: boolean = false;
  signInForm = this.formBuilder.group(
    {
      email: '',
      password: ''
    });

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private actionsService: TopBarActionsService) {
    actionsService.clear();
  }

  ngOnInit(): void {
  }

  onSignIn() {
    if (this.signInForm.valid) {
      const value = this.signInForm.value;
      this.authService.signIn(value.email ?? '', value.password ?? '', this.autoLogin)
        .then(() => {
          this.signInForm.reset();
        })
        .catch();
    }
  }
}
