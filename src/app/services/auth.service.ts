import {Injectable, OnDestroy} from '@angular/core';
import {User} from '@firebase/auth-types';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Subject, Subscription} from "rxjs";
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private currentUser = new Subject<User | null>();
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
    return this.dataService.execute(this.signInAsync(userName, password))
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
    return this.dataService.execute(this.applyActionCodeAsync(oobCode));
  }

  sendVerificationEmail(email: string) {
    return this.dataService.execute(this.sendVerificationEmailAsync(email));
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Promise<void> {
    return this.dataService.execute(this.changePasswordAsync(email, oldPassword, newPassword));
  }

  changeEmail(email: string, password: string, newEmail: string) {
    return this.dataService.execute(this.changeEmailAsync(email, password, newEmail));
  }

  changeDisplayName(email: string, password: string, displayName: string) {
    return this.dataService.execute(this.changeDisplayNameAsync(email, password, displayName));
  }

  ngOnDestroy(): void {
    this.authStateSubscription.unsubscribe();
    this.currentUser.complete();
  }

  private sendVerificationEmailAsync(email: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const user = await this.afAuth.currentUser;
      try {
        if (user) {
          await user.sendEmailVerification();
          resolve();
        } else {
          reject({message: 'errors.userNotLoggedIn'});
        }
      } catch (e) {
        reject(e);
      }
    })
  }

  private async applyActionCodeAsync(oobCode: string): Promise<void> {
    const user = await this.afAuth.currentUser;
    try {
      await this.afAuth.applyActionCode(oobCode);
      if (user) {
        await user.reload()
        return Promise.resolve();
      } else {
        return Promise.reject({message: 'errors.userNotLoggedIn'});
      }
    } catch (e) {
      return Promise.reject(e);
    }

  }

  private async changePasswordAsync(email: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      const credentials = await this.afAuth.signInWithEmailAndPassword(email, oldPassword);
      await credentials.user?.updatePassword(newPassword);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private async changeEmailAsync(email: string, password: string, newEmail: string): Promise<void> {
    try {
      const credentials = await this.afAuth.signInWithEmailAndPassword(email, password);
      await credentials.user?.verifyBeforeUpdateEmail(newEmail)
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private async changeDisplayNameAsync(email: string, password: string, displayName: string): Promise<void> {
    try {
      const credentials = await this.afAuth.signInWithEmailAndPassword(email, password);
      await credentials.user?.updateProfile({displayName: displayName})
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private async signInAsync(userName: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(userName, password)
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  private async signOutAsync(): Promise<void> {
    try {
      await this.afAuth.signOut();
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
