import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from './users.service';

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
      this.usersService.setUser(user)
        .then(() => {
          if (user) {
            if (!user.emailVerified) {
              this.router.navigate(['auth/actions'], {queryParams: {'mode': 'verifyEmail'}}).catch();
            } else {
              const redirectUrl = this.route.snapshot.queryParamMap.get('redirectURL');
              if (redirectUrl) {
                this.redirect(redirectUrl);
              } else {
                this.redirect();
              }
            }
          }
        });

    });
  }

  signIn(email: string, password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(k => {
          this.usersService.setUser(k.user).then(() => resolve())
        })
        .catch(err => reject(err));
    });
  }

  signUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.sendVerificationMail()
          .then(() => this.usersService.createUser(result.user));
      })
  }

  sendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification());
  }

  confirmVerifyEmail(oobCode: string) {
    return this.afAuth.applyActionCode(oobCode);
  }

  forgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail);
  }

  confirmPasswordReset(password: string, oobCode: string) {
    return this.afAuth
      .confirmPasswordReset(oobCode, password);
  }

  signOut() {
    return this.afAuth.signOut()
      .then(() => {
        this.usersService.signOut();
        indexedDB.deleteDatabase('firebaseLocalStorageDb');
        this.redirect('auth/sign-in');
      })
  }

  redirect(route?: string) {
    if (!route) {
      this.router.navigate([this.defaultRoute]).catch();
    } else {
      this.router.navigate([route]).catch();
    }
  }
}
