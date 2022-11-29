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

  setUser(dbUser: any | null): Promise<boolean> {
    return new Promise<boolean>(async (resolve, _) => {
      if (dbUser) {
        const userRecord = await this.db.list(this.userDbPath).query.orderByChild('uid').equalTo(dbUser.uid).limitToFirst(1).get()

        userRecord?.forEach(a => {
          const user = a?.val() as User;
          const key = a?.key;
          if (user && key) {
            this.updateUserRecord(dbUser, key, user);
            this.currentUser = user
            this.isLoggedIn.next(this.getIsLoggedIn());
            resolve(this.getIsLoggedIn())
          } else {
            this.currentUser = null;
            this.isLoggedIn.next(false);
            resolve(false);
          }
          return false;
        });

      } else {
        this.currentUser = null;
        this.isLoggedIn.next(false);
        resolve(false);
      }
    });
  }

  getIsLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  buildDbPath(dbPath: string, key?: string): any {
    if (this.currentUser?.uid) {
      const keyValue = key ? `/${key}` : '';
      return `items/${this.currentUser.uid}/${dbPath}${keyValue}`;
    }
  }

  private updateUserRecord(dbUser: any, key: string, user: User) {
    user.emailVerified = dbUser.emailVerified;
    user.email = dbUser.email;
    user.displayName = user.displayName ? user.displayName : dbUser.email;
    user.emailVerified = dbUser.emailVerified;
    this.usersRefs.update(key, user).catch(err => console.log(err));
  }
}
