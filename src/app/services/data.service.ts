import {Injectable} from '@angular/core';
import {SplashScreenStateService} from "./splash-screen-state.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private loading: SplashScreenStateService) {
  }

  execute<T>(action: Promise<T>): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      try {
        this.loading.isWorking = true;
        const result = await action;
        this.loading.isWorking = false;
        resolve(result);
      } catch (e: any) {
        this.loading.isWorking = false;
        reject(e);
      }
    });
  }
}
