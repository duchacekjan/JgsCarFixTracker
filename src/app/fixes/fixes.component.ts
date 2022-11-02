import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Fix, FixDto } from '../models/fix';
import { FixesService } from '../services/fixes.service';

@Component({
  selector: 'app-fixes',
  templateUrl: './fixes.component.html',
  styleUrls: ['./fixes.component.css']
})
export class FixesComponent implements OnInit {

  @Input()
  carKey?: string | null;
  fixes: FixDto[] = [];
  editedFix?: FixDto | null;
  createdKey?: string | null;
  constructor(private fixesService: FixesService) { }

  ngOnInit(): void {
    this.getFixes()
  }

  getFixes(): void {
    if (this.carKey) {
      this.fixesService.getFixes(this.carKey)
        .snapshotChanges().pipe(
          map(changes => {
            console.log(changes);
            return changes.map(c =>
              ({ key: c.payload.key, ...c.payload.val() }))
          })
        ).subscribe(data => {
          this.fixes = data
          if (this.createdKey) {
            const index = this.fixes.findIndex(f => f.key === this.createdKey);
            if (index > -1) {
              this.editedFix = this.fixes[index];
            }
            this.createdKey = null;
          }
        });
    }
  }

  createFix(): void {
    if (this.carKey) {
      const fix: Fix = {
        carKey: this.carKey,
        mileage: this?.fixes?.length > 0 ? Math.max(...this.fixes.map(({ mileage }) => mileage ? mileage : 0)) + 1 : 0,
        description: ''
      };
      this.createdKey = this.fixesService.create(fix);
    }
  }

  editFix(fix: FixDto): void {
    this.editedFix = fix;
  }

  saveFix(): void {
    if (this.editedFix) {
      this.fixesService.update(this.editedFix)
        .then(() => {
          this.editedFix = null;
        });
    }
  }
}
