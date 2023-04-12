import {inject, Injectable} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {NavigationService} from "../../services/navigation.service";

@Injectable({
  providedIn: 'any'
})
export class ServiceProvider {
  public readonly route = inject(ActivatedRoute)
  public readonly navigation = inject(NavigationService)
  public readonly router = this.navigation.router;
}
