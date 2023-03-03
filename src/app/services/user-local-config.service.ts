import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserLocalConfigService {

  constructor(private readonly authService: AuthService) {
  }

  save(key: string, value: string) {
    this.authService.getCurrentUser()
      .then(user => {
        if (user != null) {
          localStorage.setItem(`${user.uid}.${key}`, value);
        }
      })
  }

  load(key: string): Promise<string | null> {
    return new Promise(async (resolve) => {
      try {
        let user = await this.authService.getCurrentUser();

        if (user != null) {
          console.log(user);
          resolve(localStorage.getItem(`${user.uid}.${key}`))
        } else {
          resolve(null);
        }
      } catch (e) {
        resolve(null);
      }
    });
  }
}
