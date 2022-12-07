import {Component, ContentChild} from '@angular/core';
import {SplashScreenStateService} from "../../services/splash-screen-state.service";

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent {
  public showSplash = false;

  constructor(private splashScreenService: SplashScreenStateService) {
  }

  ngOnInit(): void {
    this.splashScreenService.subscribe((isLoading: boolean) => {
      this.toggleSplashAnimation(isLoading);
    });
  }

  private toggleSplashAnimation(isLoading: boolean) {
    if (this.showSplash == isLoading) {
      return;
    }

    setTimeout(() => {
      this.showSplash = isLoading;
    }, 0);
  }
}
