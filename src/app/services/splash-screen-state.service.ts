import {Injectable} from '@angular/core';
import {Subscription, Subject, Observer} from 'rxjs';

@Injectable()
export class SplashScreenStateService {
  private subject = new Subject<boolean>();

  subscribe(onNext: Partial<Observer<boolean>> | undefined): Subscription {
    return this.subject.subscribe(onNext);
  }

  set isWorking(value: boolean) {
    this.subject.next(value);
  }
}
