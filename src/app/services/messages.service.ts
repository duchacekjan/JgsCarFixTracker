import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {DialogComponent} from "../common/dialog/dialog.component";
import {SnackBarComponent} from "../common/snack-bar/snack-bar.component";
import {ComponentType} from "@angular/cdk/overlay";
import {DialogData} from "../common/dialog/dialog.model";
import {FirebaseError} from "firebase/app";

export enum MessageType {
  Info,
  Success,
  Error
}

export interface IMessage {
  message: string,
  interpolateParams?: Object
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  showDialog(data: DialogData): MatDialogRef<DialogComponent> {
    return this.showCustomDialog(DialogComponent, data);
  }

  showCustomDialog<T>(dialogComponent: ComponentType<T>, data: DialogData, minHeight?: string | number, minWidth?: string | number): MatDialogRef<T> {
    return this.dialog.open(dialogComponent, {
      data: data,
      minHeight: minHeight ?? '480px',
      minWidth: minWidth ?? '320px'
    });
  }

  showError(message: any | string | IMessage) {
    let finalMessage = message;
    if (message instanceof Error) {
      finalMessage = ErrorsEnum.convertMessage(message);
    }
    this.showMessage(MessageType.Error, finalMessage, true, 4000);
  }

  showInfo(message: string | IMessage) {
    this.showMessage(MessageType.Info, message, false);
  }

  showSuccess(message: string | IMessage) {
    this.showMessage(MessageType.Success, message, true, 2000);
  }

  showMessage(type: MessageType, message: string | IMessage, canDismiss: boolean = true, duration: number = 1500) {
    let panelClass = this.getPanelClass(type);
    let config = {
      data: {
        message: this.getMessage(message),
        canDismiss: canDismiss || duration < 1
      },
      duration: duration,
      panelClass: panelClass
    }
    this.snackBar.openFromComponent(SnackBarComponent, config);
  }

  private getMessage(message: string | IMessage): string {
    return isIMessage(message)
      ? this.translate.instant(message.message, message.interpolateParams)
      : message;
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

function isIMessage(object: any): object is IMessage {
  return typeof object !== 'string' && 'message' in object;
}

export namespace ErrorsEnum {
  export function convertMessage(error: Error): IMessage {
    let result = {message: 'errors.unknown'};
    if (error instanceof FirebaseError) {
      const code = error.code;
      if (code.startsWith('auth/')) {
        switch (code){
          case 'auth/email-already-in-use':
            result.message= 'errors.auth.emailAlreadyInUse'
            break;
          case 'auth/too-many-requests':
            result.message = 'errors.auth.tooManyRequests';
            break;
          default:
            result.message = 'errors.auth.login'
            break;
        }
      }
    }
    return result;
  }
}
