import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {browserLocalPersistence, getAuth, provideAuth, setPersistence, signInWithEmailAndPassword} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {getDatabase, provideDatabase} from '@angular/fire/database';
import {RouterModule} from '@angular/router';
import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {LayoutModule} from './layout/layout.module';
import {AuthService} from './services/auth.service';
import {registerLocaleData} from "@angular/common";
import localeCz from '@angular/common/locales/cs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatPaginatorIntl} from "@angular/material/paginator";
import {PaginatorIntlComponent} from "./components/cars/paginator-intl/paginator-intl.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";

registerLocaleData(localeCz);

@NgModule({
  declarations: [
    AppComponent],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    RouterModule.forRoot([]),
    LayoutModule,
    MatSnackBarModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatSnackBarModule
  ],
  providers: [AuthService, {provide: LOCALE_ID, useValue: 'cs-CZ'}, {provide: MatPaginatorIntl, useClass: PaginatorIntlComponent}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
