import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent, DialogData} from "../common/dialog/dialog.component";
import {SnackBarComponent} from "../common/snack-bar/snack-bar.component";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  showDialog(data: DialogData): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      data: data.getTranslation(this.translate),
      minHeight: '480px',
      minWidth: '320px'
    });
  }

  showError(err: string) {
    this.showMessage(MessageType.Error, err, true, 3000);
  }

  showErrorWithTranslation(err: string | Array<string>, interpolateParams?: Object) {
    this.showMessage(MessageType.Error, this.translate.instant(err, interpolateParams), true, 3000);
  }

  showMessageWithTranslation(type: MessageType, err: string | Array<string>, interpolateParams?: Object, canDismiss: boolean = true, duration: number = 1500) {
    this.showMessage(type, this.translate.instant(err, interpolateParams), canDismiss, duration)
  }

  showMessage(type: MessageType, message: string, canDismiss: boolean = true, duration: number = 1500) {
    let panelClass = this.getPanelClass(type);
    let config = {
      data: {
        message: message,
        canDismiss: canDismiss || duration < 1
      },
      duration: duration,
      panelClass: panelClass
    }
    this.snackBar.openFromComponent(SnackBarComponent, config);
  }

  private getPanelClass(type: MessageType): any {
    let panelClass = ['mat-toolbar'];
    switch (type) {
      case MessageType.Info:
        break;
      case MessageType.Success:
        panelClass.push('success-notification');
        break;
      case MessageType.Error:
        panelClass.push('mat-warn')
        break;

    }
    return panelClass;
  }
}

export enum MessageType {
  Info,
  Success,
  Error
}
