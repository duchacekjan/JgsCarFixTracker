import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MessageService, MessageType} from "../../../services/message.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      let email = this.forgotPasswordForm.value as string;
      if (email) {
        this.authService.forgotPassword(email)
          .then(() => {
            this.messageService.showMessage(MessageType.Info, 'Password reset email send, check inbox', true, 3000);
            this.forgotPasswordForm.reset();
            this.router.navigate(['sign-in']).catch();
          })
          .catch(err => this.messageService.showError(err));
      }
    }
  }
}
