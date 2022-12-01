import {Injectable} from '@angular/core';
import {SplashScreenStateService} from "./splash-screen-state.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private loading: SplashScreenStateService) {
  }

  get<T>(action: Promise<T>): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      try {
        console.log('Set loading');
        this.loading.isWorking = true;
        const result = await action;
        this.loading.isWorking = false;
        console.log('Stop loading');
        resolve(result);
      } catch (e: any) {
        reject(e);
      }
    });
  }
}
