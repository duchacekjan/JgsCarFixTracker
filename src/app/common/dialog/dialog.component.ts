import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";

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

export class TranslateDialogData extends DialogData {
  constructor() {
    super();
    this.actions.ok.label = 'buttons.ok';
    this.actions.cancel.label = 'buttons.cancel';
    this.actions.delete.label = 'buttons.delete';
  }

  getTranslation(translate: TranslateService): DialogData {
    const result = new DialogData();
    console.log(this.title);
    result.title = translate.instant(this.title);
    result.content = translate.instant(this.content);
    result.actions.ok.label = translate.instant(this.actions.ok.label);
    result.actions.cancel.label = translate.instant(this.actions.cancel.label);
    result.actions.delete.label = translate.instant(this.actions.delete.label);
    return result;
  }
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
