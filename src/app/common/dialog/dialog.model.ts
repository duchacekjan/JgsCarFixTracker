import {ThemePalette} from "@angular/material/core";

export interface DialogData {
  title: string;
  content: string;
  actions: DialogAction[];
}

export interface DialogAction {
  label: string
  color: ThemePalette

  getValue(): any;
}
