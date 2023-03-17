import {Component} from '@angular/core';
import {MenuService} from "../../../services/menu.service";
import {Observable} from "rxjs";
import {MenuItem} from "../../../models/menuItem";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  menuItems: Observable<MenuItem[]>;

  constructor(public readonly menuService: MenuService) {
    this.menuItems = menuService.getItems();
  }
}
