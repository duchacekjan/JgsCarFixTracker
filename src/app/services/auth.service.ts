import {Injectable, OnDestroy} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Subject, Subscription} from "rxjs";
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private currentUser = new Subject<any>();
  private authStateSubscription: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private dataService: DataService
  ) {
    this.authStateSubscription = this.afAuth.authState.subscribe(async (user) => {
      this.currentUser.next(user);
    });
  }

  currentUserChanged(onNext: (user: any) => void): Subscription {
    return this.currentUser.subscribe(onNext);
  }

  async getCurrentUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.afAuth.authState.subscribe({
        next: (user) => {
          unsubscribe.unsubscribe();
          resolve(user);
        },
        error: (e) => reject(e),
        complete: () => console.info('complete')
      });
    });
  }

  isSignedIn(): Promise<boolean | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.afAuth.authState.subscribe({
        next: (user) => {
          unsubscribe.unsubscribe();
          const result = user !== null
            ? user.emailVerified
            : null;
          resolve(result);
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
    return this.dataService.execute(this.afAuth.signOut());
  }

  forgotPassword(passwordResetEmail: string) {
    return this.dataService.execute(this.afAuth.sendPasswordResetEmail(passwordResetEmail));
  }

  confirmPasswordReset(password: string, oobCode: string) {
    return this.dataService.execute(this.afAuth.confirmPasswordReset(oobCode, password));
  }

  applyActionCode(oobCode: string) {
    return this.dataService.execute(this.afAuth.applyActionCode(oobCode));
  }

  sendVerificationEmail(email:string) {
    return this.dataService.execute(this.sendVerificationEmailAsync(email));
  }

  ngOnDestroy(): void {
    this.authStateSubscription.unsubscribe();
    this.currentUser.complete();
  }

  private sendVerificationEmailAsync(email: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const user = await this.afAuth.currentUser;
      if (user) {
        await user.sendEmailVerification();
        resolve();
      } else {
        reject('errors.userNotLoggedIn');
      }
    })
  }
}
