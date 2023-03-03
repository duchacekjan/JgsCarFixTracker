import {Component, OnInit} from '@angular/core';
import {SplashScreenStateService} from "../../services/splash-screen-state.service";

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {
  public showSplash = false;

  constructor(private splashScreenService: SplashScreenStateService) {
  }

  ngOnInit(): void {
    this.splashScreenService.subscribe((isLoading: boolean) => {
      this.toggleSplashAnimation(isLoading);
    });
  }

  private toggleSplashAnimation(isLoading: boolean) {
    setTimeout(() => {
      this.showSplash = isLoading;
    }, 0);
  }
}
