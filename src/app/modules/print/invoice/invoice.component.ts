import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PrintService} from "../../../services/print.service";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  invoiceIds: string[];
  invoiceDetails: Promise<any>[] = [];

  constructor(route: ActivatedRoute,
              private readonly printService: PrintService,
              private readonly dataService: DataService) {
    this.invoiceIds = route.snapshot.params['invoiceIds']
      .split(',');
  }

  ngOnInit() {
    this.invoiceDetails = this.invoiceIds
      .map(id => this.getInvoiceDetails(id));
    //this.printService.isPrinting = true;
    this.dataService.execute(Promise.all(this.invoiceDetails)
      .then(() => this.printService.onDataReady())).then();
  }

  getInvoiceDetails(invoiceId: string) {
    const amount = Math.floor((Math.random() * 100));
    return new Promise(resolve =>
      setTimeout(() => resolve({amount}), 2000)
    );
  }
}
