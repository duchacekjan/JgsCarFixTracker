import {Component} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {DataService} from "../../../services/data.service";
import {BaseAfterNavigatedHandler} from "../../../common/BaseAfterNavigatedHandler";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {Action} from "../../../models/action";

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent extends BaseAfterNavigatedHandler {
  constructor(private authService: AuthService, private router: Router, private dataService: DataService, navigation: NavigationService) {
    super(navigation);
  }

  async logout() {
    await this.dataService.execute(this.authService.signOut().then(() => {
      this.router.navigate(['auth/sign-in']).then(() => console.log('logged out'));
    }));
  }

  protected getActionsData(data: any): ActionsData {
    const addAction = new Action('add_box');
    addAction.route = '/cars/detail/new';
    addAction.tooltip = 'toolbar.newCar';

    const result = new ActionsData();
    result.actions = [addAction]
    return result;
  }

  protected isMatch(data: any): boolean {
    return data === '/cars';
  }
}
