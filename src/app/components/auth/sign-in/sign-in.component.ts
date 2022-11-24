import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TopBarActionsService} from "../../../services/top-bar-actions.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  autoLogin: boolean = false;
  signInForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

  constructor(private authService: AuthService, private actionsService: TopBarActionsService) {
    actionsService.clear();
    actionsService.updateActions();
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
