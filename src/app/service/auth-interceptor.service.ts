import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import * as HttpStatus from 'http-status-codes';
import { catchError } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(private oauthService: OAuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.oauthService.getAccessToken();

    if (token) {
      request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
      });
    }

    return next.handle(request)
      .pipe(
        catchError( error => {
          if (error instanceof HttpErrorResponse) {
              const httpErrorResponse = error as HttpErrorResponse;
              if (httpErrorResponse.status === HttpStatus.UNAUTHORIZED || httpErrorResponse.status === 0) {
                console.log('Autherror detected forcing new login. Or CORS issue');
              }
          }

          return throwError(error);
      })
    );
  }
}
