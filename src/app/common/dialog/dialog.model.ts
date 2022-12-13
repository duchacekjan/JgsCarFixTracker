import {ThemePalette} from "@angular/material/core";

export interface DialogData {
  title: string;
  content: string;
  actions: IDialogAction[];
  extraData?: any;
}

export interface IDialogAction {
  label: string
  color?: ThemePalette

  getValue(data: any): any;

  getDisabled?: (value: boolean) => boolean;
}
