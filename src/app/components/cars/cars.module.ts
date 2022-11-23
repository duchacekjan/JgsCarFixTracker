import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarsRoutingModule} from './cars-routing.module';
import {CarListComponent} from './car-list/car-list.component';
import {CarDetailComponent} from './car-detail/car-detail.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IconButtonComponent} from './icon-button/icon-button.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {CarDetailFormComponent} from './car-detail-form/car-detail-form.component';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {EditTableComponent} from './edit-table/edit-table.component';
import {MatRippleModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {SnackBarComponent} from './snack-bar/snack-bar.component';
import {MatSortModule} from "@angular/material/sort";

@NgModule({
    imports: [
        CommonModule,
        CarsRoutingModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatIconModule,
        MatCardModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatSortModule
    ],
  declarations: [CarListComponent, CarDetailComponent, IconButtonComponent, CarDetailFormComponent, EditTableComponent, SnackBarComponent]
})
export class CarsModule {
}
