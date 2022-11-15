import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";

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

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
  }

  onSignIn() {
    if (!this.signInForm.invalid) {
      const value = this.signInForm.value;
      this.authService.signIn(value.email ?? '', value.password ?? '', this.autoLogin).catch();
      this.signInForm.reset();
    }
  }
}
