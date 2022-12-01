import {Component, ContentChild} from '@angular/core';
import {SplashScreenStateService} from "../../services/splash-screen-state.service";

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent {
  private readonly ANIMATION_DURATION = 1;
  // The screen starts with the maximum opacity
  public opacityChange = 1;
  public splashTransition: any;
// First access the splash is visible
  public showSplash = true;

  constructor(private splashScreenService: SplashScreenStateService) {
  }

  ngOnInit(): void {
    this.splashScreenService.subscribe((isLoading: boolean) => {
      console.log(isLoading);
      this.toggleSplashAnimation(isLoading);
    });
  }

  private toggleSplashAnimation(isLoading: boolean) {
    if (this.showSplash == isLoading) {
      return;
    }
    if(isLoading){
      return;
    }
    // Setting the transition
    this.splashTransition = `opacity ${this.ANIMATION_DURATION}s`;
    this.opacityChange = 0;

    setTimeout(() => {
      // After the transition is ended the showSplash will be hided
      console.log('set is loading');
      //this.showSplash = isLoading;
    }, 1000);
  }
}
