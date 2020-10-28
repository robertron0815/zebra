import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { ApisettingsService } from './service/apisettings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public version = '2.0';
  public claims: any;
  public permission: boolean;

  // Overlay
  infoTitleText: string;
  infoReasonText: string;
  infoProposalText: string;
  public parentEl: HTMLElement;
  public overlayVisibility = false;
  public overlayColor: string;

  constructor(
    private oauthService: OAuthService,
    private apiSettingsService: ApisettingsService) {
    
    this.initAuthentication();
    this.oauthService.setupAutomaticSilentRefresh();

    console.log('TEST1');

  }

 /**
  * get configuration and try to login
  */
   private async initAuthentication() {
    const settings = await this.apiSettingsService.fetchSettingsAsync();
    const authCodeFlowConfig: AuthConfig = {
      issuer: settings.cloudIdpIssuer,
      clientId: settings.cloudIdpClientId,
      redirectUri: window.location.origin + '/',
      silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
      responseType: 'id_token token',
      scope: 'openid',
      timeoutFactor: 0.75
    };

    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    // this.oauthService.setupAutomaticSilentRefresh(authCodeFlowConfig, 'access_token');

  }

  /**
   * manual login triggerd by user
   */
  login(): void {
    this.oauthService.initImplicitFlow();
  }

  /**
   * manual logout triggered by user
   */
  logout(): void {
    this.oauthService.logOut();
  }

  /**
   * check if user is logged in
   */
  get isAuthenticated(): boolean {
    this.claims = this.oauthService.getIdentityClaims();
    if (this.claims !== undefined && this.claims !== null) {
      this.checkPermission();

      if (this.permission) {
        // logged in
        return true;
      }
    }

    // not logged in
    return false;
  }

  /**
   * check if user has permission to scan
   */
  checkPermission() {
    if (this.claims.groups) {
        if (this.claims.groups.indexOf('VWAG_Z_TNT_APP_SCAN') >= 0 ||
            this.claims.groups.indexOf('VWAG_Z_TNT_APP_ADMIN') >= 0
        ) {
            this.permission = true;
        } else {
          this.setOverlay('- Login nicht möglich -',
          'Ihnen fehlen die notwendigen KIRA-Rollen.',
          'Bitte wenden Sie sich an die IT-Hotline, ' +
          'Tel. 5000, it-hotline-vws@volkswagen.de');
            this.permission = false;
        }
    } else {
        this.setOverlay('- Login nicht möglich -',
                        'Ihnen fehlen die notwendigen KIRA-Rollen.',
                        'Bitte wenden Sie sich an die IT-Hotline, ' +
                        'Tel. 5000, it-hotline-vws@volkswagen.de');
        this.permission = false;
    }
  }

  setOverlay(infoTitleText: string, infoReasonText: string, infoProposalText: string) {
      this.infoTitleText = infoTitleText;
      this.infoReasonText = infoReasonText;
      this.infoProposalText = infoProposalText;
      this.overlayColor = 'rgba(218, 12, 31, 0.8)';
      this.overlayVisibility = true;
  }

  notAuthorizedLogout() {
      this.overlayVisibility = false;
      this.logout();
  }
}
