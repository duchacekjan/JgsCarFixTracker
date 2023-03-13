import {NgModule} from '@angular/core';
import {PrintRouterModule} from "./print-routing.module";
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { InvoiceComponent } from './invoice/invoice.component';

@NgModule({
  imports: [
    PrintRouterModule
  ],
  declarations: [
    PrintLayoutComponent,
    InvoiceComponent
  ]
})
export class PrintModule {
}
