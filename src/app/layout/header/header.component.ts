import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {UsersService} from 'src/app/services/users.service';
import {environment} from "../../../environments/environment";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  version: any;
  isLoggedIn = false;
  isInDetail = true;

  constructor(
    public authService: AuthService,
    private usersService: UsersService,
    private router: Router) {
    this.version = environment.appVersion;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isInDetail = !!event.urlAfterRedirects.match('^\/cars\/detail\/');
      }
    })
  }

  ngOnInit(): void {
    this.usersService.isLoggedIn
      .subscribe(
        isLoggedIn => {
          this.isLoggedIn = isLoggedIn
        }
      )
  }

  goBack() {
    this.router.navigate(['/cars']).catch();
  }
}
