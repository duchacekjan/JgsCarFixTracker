import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

export class DialogData {
  constructor() {
  }

  title!: string;
  content!: string;
  actions: any = {
    ok: {
      label: 'OK',
      isVisible: true
    },
    cancel: {
      label: 'Cancel',
      isVisible: true
    },
    delete: {
      label: 'Delete',
      isVisible: false
    }
  }

  setOk(isVisible: boolean, label: string | null = null) {
    this.actions.ok = this.toAction(label ?? this.actions.ok.label, isVisible);
  }

  setDelete(isVisible: boolean, label: string | null = null) {
    this.actions.delete = this.toAction(label ?? this.actions.delete.label, isVisible);
  }

  setCancel(isVisible: boolean, label: string | null = null) {
    this.actions.cancel = this.toAction(label ?? this.actions.cancel.label, isVisible);
  }

  private toAction(label: string, isVisible: boolean): any {
    return {
      label: label,
      isVisible: isVisible
    };
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

}
