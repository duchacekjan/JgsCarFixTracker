import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {Observable, of} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, AfterViewInit {
  myItems: Observable<any> | null = null;
  user: any;

  constructor(private dataService: DataService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataService.execute(this.data()).then(data => {
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

  onSignIn() {
    this.authService
      .signIn('jgs.nuget@gmail.com', '123456')
      .then(async user => {
        this.user = user.user?.uid;
        const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl') ?? '';
        await this.router.navigate([redirectUrl], {replaceUrl: true, relativeTo: this.route});
      });
  }
}
