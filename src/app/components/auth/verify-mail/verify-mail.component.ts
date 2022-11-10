import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {UsersService} from "../../../services/users.service";

@Component({
  selector: 'app-verify-mail',
  templateUrl: './verify-mail.component.html',
  styleUrls: ['./verify-mail.component.css']
})
export class VerifyMailComponent implements OnInit {

  constructor(public authService: AuthService, public usersService: UsersService) {
  }

  ngOnInit(): void {
  }

}
