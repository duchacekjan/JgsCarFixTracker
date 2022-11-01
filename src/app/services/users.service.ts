import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private userDbPath = '/users';
  private userKey = 'user';

  constructor(private afDb: AngularFireDatabase) { }
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
    localStorage.removeItem(this.userKey);
  }

  setUser(user: any) {
    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } else {
      localStorage.setItem(this.userKey, 'null');
    }
  }

  getUserData(): any {
    return JSON.parse(localStorage.getItem('user')!);
  }

  getIsLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem(this.userKey)!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

}
