import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface IPair {
  timestamp: number;
  id: string;
  kennNr: string;
}

interface IUnpair {
  timestamp: number;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class PairingService {
  private REST_URL: string;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
  ) {
    // Fetch settings from backend
    this.http.get<any>(environment.SETTINGS_URI)
      .subscribe(res => this.REST_URL = res.REST_URL);
  }

  postPairIds(carId: string, beaconId: string): Observable<JSON> {
    const body: IPair = {
      timestamp: Date.now(),
      id: beaconId,
      kennNr: carId,
    };

    return this.http.post<JSON>(this.REST_URL + '/pairing', body, this.httpOptions);
  }

  postUnpairIds(beaconId: string): Observable<JSON> {
    const body: IUnpair = {
      timestamp: Date.now(),
      id: beaconId,
    };

    return this.http.post<JSON>(this.REST_URL + '/unpairing', body, this.httpOptions);
  }
}
