import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData: any;
  private userDbPath = '/users';
  private userKey = 'user';
  private defaultRoute = 'cars';
  constructor(
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem(this.userKey, JSON.stringify(this.userData));
        //JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem(this.userKey, 'null');
        //JSON.parse(localStorage.getItem('user')!);
      }
    })
  }

  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.redirect();
          }
        });
      })
      .catch(this.errorHandler)
  }

  signUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.sendVerificationMail();
        this.setUserData(result.user);
      })
      .catch(this.errorHandler)
  }

  sendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.redirect('auth/verify-email');
      })
  }

  forgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email send, check inbox');
      })
      .catch(this.errorHandler);
  }

  getIsLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem(this.userKey)!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  authLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.setUserData(result.user);
        this.redirect();
      })
      .catch(this.errorHandler);
  }

  setUserData(user: any) {
    const userRefs = this.afDb.list(this.userDbPath);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified
    };
    return userRefs.push(userData);
  }

  signOut() {
    return this.afAuth.signOut()
      .then(() => {
        localStorage.removeItem(this.userKey);
        this.redirect('auth/sign-in')
      })
  }

  errorHandler(error: any) {
    window.alert(error.message);
  }

  redirect(route?: string) {
    const target = route !== null ? route : this.defaultRoute;
    this.router.navigate([target]);
  }
}
