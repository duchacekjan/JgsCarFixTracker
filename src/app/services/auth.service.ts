import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private defaultRoute = 'cars';
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private usersService: UsersService
  ) {
    this.afAuth.authState.subscribe((user) => {
      usersService.setUser(user);
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
        this.usersService.setUserData(result.user);
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

  authLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.usersService.setUserData(result.user);
        this.redirect();
      })
      .catch(this.errorHandler);
  }



  signOut() {
    return this.afAuth.signOut()
      .then(() => {
        this.usersService.signOut();
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
