import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TopBarActionsService} from "../../../services/top-bar-actions.service";
import {MessageService} from "../../../services/message.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

  constructor(private authService: AuthService, private actionsService: TopBarActionsService, private router: Router, private messageService: MessageService) {
    actionsService.clear();
    actionsService.updateActions();
  }

  ngOnInit(): void {
  }

  onSignIn() {
    if (this.signInForm.valid) {
      const value = this.signInForm.value;
      this.authService.signIn(value.email ?? '', value.password ?? '')
        .then(() => {
          this.signInForm.reset();
        })
        .catch(err => {
          this.messageService.showError(err);
          this.router.navigate(['/cars']).catch(err => this.messageService.showError(err));
        });
    }
  }
}
