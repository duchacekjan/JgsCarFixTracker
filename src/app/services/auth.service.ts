import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private defaultRoute = '/cars';
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private usersService: UsersService,
    private route: ActivatedRoute
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.usersService.setUser(user);
        const redirectUrl = this.route.snapshot.queryParamMap.get('redirectURL');
        if (redirectUrl) {
          this.redirect(redirectUrl);
        } else {
          this.redirect();
        }
      }
    });
  }

  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
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

  signOut() {
    return this.afAuth.signOut()
      .then(() => {
        this.usersService.signOut();
        this.redirect('auth/sign-in');
      })
  }

  errorHandler(error: any) {
    window.alert(error.message);
  }

  redirect(route?: string) {
    if (!route) {
      this.router.navigate([this.defaultRoute]);
    } else {
      this.router.navigate([route]);
    }
  }
}
