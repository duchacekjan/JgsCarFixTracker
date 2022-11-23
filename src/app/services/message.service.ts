import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../components/cars/snack-bar/snack-bar.component";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private snackBar = inject(MatSnackBar);

  showError(err: string){
    this.showMessage(MessageType.Error, err, true, 3000);
  }
  showMessage(type: MessageType, message: string, canDismiss: boolean, duration: number) {
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
