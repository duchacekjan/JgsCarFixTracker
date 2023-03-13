import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {getDatabase, provideDatabase} from '@angular/fire/database';
import {RouterModule, Routes, TitleStrategy} from '@angular/router';
import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {CommonModule, registerLocaleData} from "@angular/common";
import localeCz from '@angular/common/locales/cs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {MaterialModule} from "./material.module";
import {AppServicesModule} from "./services/services.module";
import {AppLayoutModule} from "./modules/layout/app-layout.module";
import {JgsErrorHandler} from "./common/jgs-error.handler";
import {JgsTitleStrategy} from "./common/jgs-title.strategy";
import {GeneralSettingsComponent} from "./modules/settings/general/general-settings.component";
import {UserProfileComponent} from "./modules/settings/user-profile/user-profile.component";
import {BackLinkResolver} from "./common/resolvers/back-link.resolver";
import {LayoutModule} from "@angular/cdk/layout";
import {PrintModule} from "./modules/print/print.module";

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
    const parts = params.key.split('.');
    //return `['${parts[parts.length - 1]}']`;
    return `[${params.key}]`;
  }
}

const routes: Routes = [
  {path: '', loadChildren: () => PrintModule},
  {path: '', loadChildren: () => LayoutModule}
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    RouterModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    RouterModule.forRoot(routes),
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
    AppLayoutModule,
    PrintModule,
    AppServicesModule
  ],
  exports: [],
  providers: [
    {provide: LOCALE_ID, useValue: 'cs-CZ'},
    {provide: ErrorHandler, useClass: JgsErrorHandler},
    {provide: TitleStrategy, useClass: JgsTitleStrategy}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
