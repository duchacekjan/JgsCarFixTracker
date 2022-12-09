import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
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

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

}
