import { Component } from '@angular/core';
import {SplashScreenStateService} from "../../services/splas-screen-state.service";

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent {
  // The screen starts with the maximum opacity
  public opacityChange = 1;

  public splashTransition: any;

// First access the splash is visible
  public showSplash = false;

  readonly ANIMATION_DURATION = 1;

  constructor(private splashScreenService: SplashScreenStateService) {
  }

  ngOnInit(): void {
    this.splashScreenService.subscribe((isLoading) => {
      this.hideSplashAnimation(isLoading);
    });
  }

  private hideSplashAnimation(isLoading:boolean) {
    // Setting the transition
    // this.splashTransition = `opacity ${this.ANIMATION_DURATION}s`;
    // this.opacityChange = 0;

    setTimeout(() => {
      // After the transition is ended the showSplash will be hided
      this.showSplash = isLoading;
    }, 1000);
  }
}
