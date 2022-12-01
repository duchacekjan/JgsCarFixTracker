import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, AfterViewInit {
  myItems: Observable<any> | null = null;

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataService.get(this.data()).then(data => {
      this.myItems = data;
    });
  }

  private data(): Promise<Observable<any>> {
    return new Promise<Observable<any>>(resolve => {
      console.log('before timeout');
      setTimeout(() => {
        console.log('in timeout');
        resolve(of(['item1', 'item2']));
      }, 5000)
    })
  }
}
