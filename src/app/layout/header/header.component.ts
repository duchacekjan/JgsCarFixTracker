import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: Boolean = false;
  constructor(public authService: AuthService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.isLoggedIn
      .subscribe(
        isLoggedIn => { this.isLoggedIn = isLoggedIn }
      )
  }
}
