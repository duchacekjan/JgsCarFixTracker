import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private userDbPath = '/users';
  private userKey = 'user';
  private subject = new Subject<User>();

  constructor(private db: AngularFireDatabase) { }
  setUserData(user: any) {
    const userRefs = this.db.list(this.userDbPath);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ? user.displayName : user.email,
      emailVerified: user.emailVerified,
      isAdmin: false
    };
    return userRefs.push(userData);
  }

  signOut() {
    localStorage.removeItem(this.userKey);
  }

  setUser(userData: any) {
    if (userData) {
      localStorage.setItem(this.userKey, JSON.stringify(userData));
    } else {
      localStorage.setItem(this.userKey, 'null');
    }
  }

  getUserData(): Observable<User> {
    var userData = JSON.parse(localStorage.getItem('user')!);
    this.db.list(`${this.userDbPath}`, ref => ref.orderByChild('uid').equalTo(userData.uid).limitToFirst(1))
      .valueChanges()
      .subscribe(data => {
        data.forEach(item => this.subject.next(item as User))
      });
    return this.subject;
  }

  getIsLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem(this.userKey)!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  buildDbPath(dbPath: string, key?: string): any {
    const user = JSON.parse(localStorage.getItem(this.userKey)!);
    if (user?.uid) {
      const keyValue = key ? `/${key}` : '';
      return `items/${user.uid}/${dbPath}${keyValue}`;
    }
  }
}
