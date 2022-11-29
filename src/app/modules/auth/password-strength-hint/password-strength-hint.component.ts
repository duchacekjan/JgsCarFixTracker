import {Component, Input, OnInit} from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {PasswordStrength} from "../../../services/common.service";

export interface PasswordStrengthInfo {
  strength: PasswordStrength,
  score: number,
  color: ThemePalette,
  text: string
}

@Component({
  selector: 'app-password-strength-hint',
  templateUrl: './password-strength-hint.component.html',
  styleUrls: ['./password-strength-hint.component.scss']
})
export class PasswordStrengthHintComponent implements OnInit {

  @Input() strength!: PasswordStrengthInfo

  constructor() {
  }

  ngOnInit(): void {
  }

}
