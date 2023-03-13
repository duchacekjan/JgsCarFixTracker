import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PrintLayoutComponent} from "./print-layout/print-layout.component";
import {InvoiceComponent} from "./invoice/invoice.component";

const routes: Routes = [
  {
    path: '',
    outlet: 'print',
    component: PrintLayoutComponent,
    children: [
      {path: 'invoice/:invoiceIds', component: InvoiceComponent},
    ],
    //resolve: {'back-link': BackLinkResolver} RESOLVE INVOICE
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRouterModule {
}
