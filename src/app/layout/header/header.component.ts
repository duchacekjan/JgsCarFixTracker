import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  version:any;
  isLoggedIn: Boolean = false;
  constructor(public authService: AuthService, private usersService: UsersService) {
    this.version = environment.appVersion;
  }

  ngOnInit(): void {
    this.usersService.isLoggedIn
      .subscribe(
        isLoggedIn => { this.isLoggedIn = isLoggedIn }
      )
  }
}
