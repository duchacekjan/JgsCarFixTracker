import {Component} from '@angular/core';
import {PrintService} from "./services/print.service";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isDebug = !environment.production;

  constructor(public readonly printService: PrintService) {
  }

  onPrint() {
    this.printService.printDocument('invoice', ['1,2,3'])
  }
}
