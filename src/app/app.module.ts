import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {getDatabase, provideDatabase} from '@angular/fire/database';
import {RouterModule} from '@angular/router';
import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {CommonModule, registerLocaleData} from "@angular/common";
import localeCz from '@angular/common/locales/cs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {MaterialModule} from "./material.module";
import {AppRoutingModule} from "./app-routing.module";
import {AppServicesModule} from "./services/services.module";
import {AppAuthModule} from "./modules/auth/auth.module";
import {AppCommonModule} from "./common/app-common.module";

registerLocaleData(localeCz);

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

/**
 * Handles missing translations
 */
export class CustomMissingTranslationHandler implements MissingTranslationHandler {
  public handle(params: MissingTranslationHandlerParams): string {
    return `['${params.key}']`;
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    RouterModule.forRoot([]),
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'cs',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: CustomMissingTranslationHandler
      }
    }),
    AppCommonModule,
    AppAuthModule,
    AppRoutingModule,
    AppServicesModule
  ],
  exports: [],
  providers: [
    {provide: LOCALE_ID, useValue: 'cs-CZ'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
