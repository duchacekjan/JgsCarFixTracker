import {Params} from "@angular/router";
import {ThemePalette} from "@angular/material/core";

export class TopBarAction {
  constructor(icon: string) {
    this.icon = icon;
  }

  icon: string = '';
  route: string = '';
  queryParams: Params | null = null;
  color: ThemePalette | null = null;
  tooltip: string = '';
}
