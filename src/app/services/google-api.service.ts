import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin, //En produccion poner: https://galeria-de-viajes.web.app
  clientId: '813133779304-eb5po2bdfk1gfjrndh4d5udtb606e0kl.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/photoslibrary.readonly',
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  private initializedSubject = new Subject<void>();
  public initialized$ = this.initializedSubject.asObservable();

  constructor(private readonly oAuthService: OAuthService) {
    oAuthService.configure(oAuthConfig);
    oAuthService.loadDiscoveryDocument().then(() => {
      oAuthService.tryLoginImplicitFlow().then(() => {
        if (!oAuthService.hasValidAccessToken()) {
          oAuthService.initLoginFlow();
        } else {
          oAuthService.loadUserProfile().then(userProfile => {
            console.log(JSON.stringify(userProfile));
          });
        }
        this.initializedSubject.next();
      });
    });
  }
}
