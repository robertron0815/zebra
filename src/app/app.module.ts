import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/** MODULES */
import { AppRoutingModule } from './router/app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthInterceptorService } from './service/auth-interceptor.service';
import { AuthguardService } from './service/authguard.service';

/** VIEWS */
import { AppComponent } from './app.component';
import { PairingComponent } from './views/pairing/pairing.component';
import { UnpairingComponent } from './views/unpairing/unpairing.component';

/** COMPONENTS */
import { OverlayComponent } from './components/overlay/overlay.component';
import { NotAuthorisedOverlayComponent } from './components/not-authorised-overlay/not-authorised-overlay.component';

@NgModule({
  declarations: [
    AppComponent,
    PairingComponent,
    UnpairingComponent,
    OverlayComponent,
    NotAuthorisedOverlayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    OAuthModule.forRoot(),
  ],
  providers: [AuthguardService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
