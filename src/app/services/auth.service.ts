import {Injectable, OnDestroy} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Subject, Subscription} from "rxjs";
import {DataService} from "./data.service";

@Injectable()
export class AuthService implements OnDestroy {

  currentUser = new Subject<any>();
  private authStateSubscription: Subscription;
  private _currentUser: any;

  constructor(
    private afAuth: AngularFireAuth,
    private dataService: DataService
  ) {
    this.authStateSubscription = this.afAuth.authState.subscribe(async (user) => {
      console.log(user?.uid)
      this._currentUser = user;
      this.currentUser.next(user);
    });
  }

  isSignedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.afAuth.authState.subscribe({
        next: (user) => {
          unsubscribe.unsubscribe();
          resolve(user?.emailVerified == true);
        },
        error: (e) => reject(e),
        complete: () => console.info('complete')
      });
    });
  }

  signIn(userName: string, password: string) {
    return this.dataService.execute(this.afAuth.signInWithEmailAndPassword(userName, password))
  }

  signOut() {
    return this.afAuth.signOut();
  }

  ngOnDestroy(): void {
    this.authStateSubscription.unsubscribe();
    this.currentUser.complete();
  }
}
