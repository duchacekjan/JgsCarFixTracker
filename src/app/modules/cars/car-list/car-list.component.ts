import {Component} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent {
  constructor(private authService: AuthService, private router: Router, private dataService: DataService) {
  }

  async logout() {
    await this.dataService.execute(this.authService.signOut().then(() => {
      this.router.navigate(['auth/sign-in']).then(() => console.log('logged out'));
    }));
  }
}
