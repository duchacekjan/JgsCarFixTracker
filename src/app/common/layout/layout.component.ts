import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ActionsService} from "../../services/actions.service";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {UsersService} from "../../services/users.service";
import {SettingsService} from "../../services/settings.service";
import {OverlayContainer} from "@angular/cdk/overlay";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {User} from "../../models/user";
import {Action} from "../../models/action";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  actions: Action[] = [];
  backAction = false;
  isLoggedIn = false;
  version: string;
  user: User | null = null;

  private actionsSubscription = new Subscription();
  private backActionSubscription = new Subscription();
  private authUserSubscription = new Subscription();
  private themeModeSubscription = new Subscription();

  constructor(
    public authService: AuthService,
    private actionsService: ActionsService,
    private userService: UsersService,
    private settingsService: SettingsService,
    private renderer: Renderer2,
    private overlay: OverlayContainer,
    private router: Router,
    private route: ActivatedRoute) {
    this.version = environment.appVersion;
  }

  ngOnInit(): void {
    this.authUserSubscription = this.userService.isLoggedIn.subscribe(s => {
      this.isLoggedIn = s
      this.user = this.userService.currentUser;
    });
    this.actionsSubscription = this.actionsService.actions
      .subscribe(actions => this.actions = actions);
    this.backActionSubscription = this.actionsService.backAction
      .subscribe(s => this.backAction = s);
    this.themeModeSubscription = this.settingsService.modeChanged
      .subscribe(() => this.updateThemeMode());
    this.updateThemeMode();
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.backActionSubscription.unsubscribe();
    this.authUserSubscription.unsubscribe();
    this.themeModeSubscription.unsubscribe();
  }

  showSettings() {
    this.router.navigate(['/settings'], {queryParams: {'backLink': this.router.url}}).then(() => {
      this.actionsService.clear();
      this.actionsService.showBackAction();
      this.actionsService.updateActions();
    });
  }

  backClick() {
    const backLink = this.route.snapshot.queryParams['backLink'] ?? '/cars';
    this.router.navigate([backLink]).catch();
  }

  private updateThemeMode() {
    const darkClassName = 'darkMode';
    if (this.settingsService.isDarkMode) {
      this.renderer.addClass(document.body, darkClassName);
      this.overlay.getContainerElement().classList.add(darkClassName);
    } else {
      this.renderer.removeClass(document.body, darkClassName);
      this.overlay.getContainerElement().classList.remove(darkClassName);
    }
  }
}
