import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  autoLogin: boolean = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  signIn(username: string, password: string) {
    this.authService.signIn(username, password, this.autoLogin)
  }
}