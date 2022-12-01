import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';

@Injectable()
export class SplashScreenStateService {
  private subject = new Subject<boolean>();

  subscribe(onNext: (isLoading: boolean) => void): Subscription {
    return this.subject.subscribe(onNext);
  }

  set isWorking(value: boolean) {
    this.subject.next(value);
  }
}
