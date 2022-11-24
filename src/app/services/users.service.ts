import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/compat/database';
import {Subject} from 'rxjs';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private userDbPath = '/users';
  isLoggedIn = new Subject<boolean>();

  currentUser: User | null = null;
  private usersRefs: AngularFireList<User>

  constructor(private db: AngularFireDatabase) {
    this.usersRefs = this.db.list(this.userDbPath);
  }

  createUser(user: any) {
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ? user.displayName : user.email,
      emailVerified: user.emailVerified,
      isAdmin: false
    };
    return this.usersRefs.push(userData);
  }

  signOut() {
    this.setUser(null).catch();
  }

  setUser(uid: any): Promise<boolean> {
    return new Promise<boolean>((resolve, _) => {
      if (uid) {
        this.db.list<User>(this.userDbPath, ref => ref.orderByChild('uid').equalTo(uid).limitToFirst(1))
          .valueChanges()
          .subscribe(data => {
            data.forEach(user => {
              this.currentUser = user
              this.isLoggedIn.next(this.getIsLoggedIn());
              resolve(this.getIsLoggedIn())
            })
          });
      } else {
        this.currentUser = null;
        this.isLoggedIn.next(false);
        resolve(false);
      }
    });

  }

  getIsLoggedIn(): boolean {
    return this.currentUser !== null && this.currentUser.emailVerified;
  }

  buildDbPath(dbPath: string, key?: string): any {
    if (this.currentUser?.uid) {
      const keyValue = key ? `/${key}` : '';
      return `items/${this.currentUser.uid}/${dbPath}${keyValue}`;
    }
  }
}
