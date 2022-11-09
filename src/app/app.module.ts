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
    LayoutModule
  ],
  providers: [AuthService, {provide: LOCALE_ID, useValue: 'cs-CZ'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
