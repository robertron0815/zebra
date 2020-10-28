import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, timeout } from 'rxjs/operators';
import { ISettings, IApiSettings } from '../interface/settings';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApisettingsService {

  constructor(private httpClient: HttpClient) { }

  public async fetchSettingsAsync(): Promise<ISettings> {
    let settings: ISettings = null;
    try {
        settings = await this.httpClient
                             .get<IApiSettings>(environment.settingsApi)
                             .pipe
                             (
                                 timeout(1500),
                                 map(apiSetting => this.mapApiSettings(apiSetting)),
                             )
                             .toPromise();
    } catch (error) {
        console.error('cannot get api settings:', error);
    }

    return settings;
  }

  /**
   * map setting for usage
   * @param apiSettings settings object
   */
  public mapApiSettings(apiSettings: IApiSettings): ISettings {
    return {
        cloudIdpClientId: apiSettings.CLOUDIDP_CLIENTID,
        cloudIdpIssuer: apiSettings.CLOUDIDP_ISSUER
    };
  }
}
